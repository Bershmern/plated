import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '../../../../lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const tableLabel = searchParams.get('t') || '1';
  const outletSlug = params.slug;

  try {
    const supabase = createServerClient();

    // ─── 1. Resolve Outlet & Chain ───────────────────────────────────────────
    const { data: outlet, error: outletErr } = await supabase
      .from('outlets')
      .select('*, chain:chains(*)')
      .eq('slug', outletSlug)
      .eq('is_active', true)
      .single();

    if (outletErr || !outlet) {
      return NextResponse.json(
        { error: { code: 'outlet_not_found', message: 'No outlet found with that slug' } },
        { status: 404 }
      );
    }

    const chain = outlet.chain;

    if (chain.status !== 'active') {
      return NextResponse.json(
        { error: { code: 'chain_suspended', message: 'This restaurant is not currently active' } },
        { status: 403 }
      );
    }

    // ─── 2. Device Identity (cookie-based, no auth required) ─────────────────
    const existingDeviceId = request.cookies.get('__plated_device_id')?.value;
    let deviceId = existingDeviceId;

    if (!deviceId) {
      // Mint new device ID
      deviceId = crypto.randomUUID();
      await supabase.from('diner_devices').insert({
        id: deviceId,
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      });
    } else {
      // Touch last_seen
      supabase
        .from('diner_devices')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', deviceId)
        .then();
    }

    // ─── 3. Recognition Lookup ────────────────────────────────────────────────
    let recognition = null;
    const { data: profile } = await supabase
      .from('diner_profiles')
      .select('*')
      .eq('device_id', deviceId)
      .eq('chain_id', chain.id)
      .maybeSingle();

    if (profile && profile.last_order_id && profile.order_count > 0) {
      const windowDays = chain.recognition_window_days || 90;
      const isWithinWindow =
        profile.last_order_at &&
        new Date(profile.last_order_at).getTime() >= Date.now() - windowDays * 86400 * 1000;

      if (isWithinWindow) {
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('menu_item_id, qty, name_snapshot, options:order_item_options(name_snapshot, price_delta_minor_snapshot)')
          .eq('order_id', profile.last_order_id);

        const { data: lastOrder } = await supabase
          .from('orders')
          .select('placed_at, subtotal_minor')
          .eq('id', profile.last_order_id)
          .single();

        if (lastOrder) {
          recognition = {
            order_count: profile.order_count,
            last_order: {
              placed_at: lastOrder.placed_at,
              outlet_name: outlet.name,
              subtotal_minor: lastOrder.subtotal_minor,
              items: (orderItems || []).map((it: any) => ({
                menu_item_id: it.menu_item_id,
                name_snapshot: it.name_snapshot,
                qty: it.qty,
                options: (it.options || []).map((o: any) => ({
                  name: o.name_snapshot,
                  price_delta_minor: o.price_delta_minor_snapshot,
                })),
              })),
            },
          };
        }
      }
    }

    // ─── 4. Fetch Menu Categories ─────────────────────────────────────────────
    const { data: categories, error: catErr } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('chain_id', chain.id)
      .order('position', { ascending: true });

    if (catErr) throw catErr;

    // ─── 5. Fetch Menu Items ──────────────────────────────────────────────────
    const { data: menuItems, error: itemsErr } = await supabase
      .from('menu_items')
      .select('*')
      .eq('chain_id', chain.id)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (itemsErr) throw itemsErr;

    // ─── 6. Fetch Outlet Availability Overrides ───────────────────────────────
    const { data: outletOverrides } = await supabase
      .from('outlet_menu_items')
      .select('*')
      .eq('outlet_id', outlet.id);

    const overridesMap = new Map(
      (outletOverrides || []).map((o: any) => [o.menu_item_id, o])
    );

    // ─── 7. Fetch Option Groups & Options ─────────────────────────────────────
    const { data: optionGroups } = await supabase
      .from('option_groups')
      .select('*, options(*)')
      .eq('chain_id', chain.id)
      .order('position', { ascending: true });

    const groupsMap = new Map<string, any[]>();
    (optionGroups || []).forEach((og: any) => {
      const list = groupsMap.get(og.menu_item_id) || [];
      list.push({
        id: og.id,
        name: og.name,
        min_select: og.min_select,
        max_select: og.max_select,
        position: og.position,
        options: (og.options || [])
          .filter((opt: any) => opt.is_active)
          .sort((a: any, b: any) => a.position - b.position)
          .map((opt: any) => ({
            id: opt.id,
            name: opt.name,
            price_delta_minor: opt.price_delta_minor,
          })),
      });
      groupsMap.set(og.menu_item_id, list);
    });

    // ─── 8. Shape Items per Category ─────────────────────────────────────────
    const shapedCategories = (categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      position: cat.position,
    }));

    const shapedItems = (menuItems || []).map((mi: any) => {
      const override = overridesMap.get(mi.id) as any;
      const is_listed = override ? override.is_listed : true;
      const in_stock = override ? override.in_stock : true;

      return {
        id: mi.id,
        category_id: mi.category_id,
        name: mi.name,
        description: mi.description,
        price_minor: mi.price_minor,
        currency: mi.currency || 'NGN',
        image_url: mi.image_url,
        image_ready: mi.image_ready,
        is_listed,
        in_stock,
        option_groups: groupsMap.get(mi.id) || [],
      };
    });

    // ─── 9. Build Response ────────────────────────────────────────────────────
    const response = NextResponse.json({
      outlet: {
        id: outlet.id,
        slug: outlet.slug,
        name: outlet.name,
        address: outlet.address,
        city: outlet.city,
        is_active: outlet.is_active,
        service_day_start: outlet.service_day_start,
        chain: {
          id: chain.id,
          name: chain.name,
          display_name: chain.display_name,
          slug: chain.slug,
          accent_hex: chain.accent_hex,
          accent_ink: chain.accent_ink,
          logo_url: chain.logo_url,
          status: chain.status,
        },
      },
      table: { label: tableLabel },
      recognition,
      categories: shapedCategories,
      items: shapedItems,
    });

    // Set device cookie if new
    if (!existingDeviceId) {
      response.cookies.set('__plated_device_id', deviceId, {
        maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
    }

    return response;
  } catch (err: any) {
    console.error('[scan] Error:', err);
    return NextResponse.json(
      { error: { code: 'internal', message: err.message } },
      { status: 500 }
    );
  }
}
