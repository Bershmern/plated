import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseServiceClient } from '../_shared/supabase.ts';
import { resolveDeviceIdentity } from '../_shared/device.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const outletSlug = url.searchParams.get('outlet');
    const tableLabel = url.searchParams.get('t') || '1';

    if (!outletSlug) {
      return new Response(
        JSON.stringify({ error: { code: 'bad_request', message: 'Missing outlet query parameter' } }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // 1. Resolve Outlet & Chain
    const { data: outlet, error: outletErr } = await supabase
      .from('outlets')
      .select('*, chain:chains(*)')
      .eq('slug', outletSlug)
      .single();

    if (outletErr || !outlet) {
      return new Response(
        JSON.stringify({ error: { code: 'outlet_not_found', message: 'No outlet found with that slug' } }),
        { headers: corsHeaders, status: 404 }
      );
    }

    const chain = outlet.chain;
    const isOpen = outlet.is_active && chain.status === 'active';

    // 2. Resolve Device Identity
    const deviceRes = await resolveDeviceIdentity(req);
    const responseHeaders = {
      ...corsHeaders,
      'Set-Cookie': deviceRes.cookieHeader,
    };

    // Closed venue return state (API_CONTRACTS.md §2)
    if (!isOpen) {
      return new Response(
        JSON.stringify({
          device: { token: deviceRes.token, is_new: deviceRes.isNew },
          chain: {
            id: chain.id,
            name: chain.name,
            display_name: chain.display_name,
            logo_url: chain.logo_url,
            accent: chain.accent_hex,
            accent_ink: chain.accent_ink,
          },
          outlet: {
            id: outlet.id,
            slug: outlet.slug,
            name: outlet.name,
            is_open: false,
            timezone: outlet.timezone,
            table_label: tableLabel,
          },
          menu: { categories: [] },
          session: null,
          recognition: null,
        }),
        { headers: responseHeaders, status: 200 }
      );
    }

    // 3. Perform Recognition Lookup (USP 2)
    let recognitionPayload = null;
    const { data: profile } = await supabase
      .from('diner_profiles')
      .select('*')
      .eq('device_id', deviceRes.deviceId)
      .eq('chain_id', chain.id)
      .maybeSingle();

    if (profile) {
      let lastOrderPayload = null;
      const windowDays = chain.recognition_window_days || 90;
      const isWithinWindow =
        profile.last_order_at &&
        new Date(profile.last_order_at).getTime() >= Date.now() - windowDays * 86400 * 1000;

      if (isWithinWindow && profile.last_order_id) {
        const { data: orderItems } = await supabase
          .from('order_items')
          .select(`
            menu_item_id, qty, name_snapshot,
            menu_item:menu_items(*),
            outlet_override:outlet_menu_items!left(*),
            options:order_item_options(*)
          `)
          .eq('order_id', profile.last_order_id);

        if (orderItems) {
          const { data: lastOrder } = await supabase
            .from('orders')
            .select('placed_at, outlet:outlets(name)')
            .eq('id', profile.last_order_id)
            .single();

          const resolvedItems = orderItems.map((item: any) => {
            const mi = item.menu_item;
            const omi = item.outlet_override;

            let availability = 'available';
            let goneFromChain = false;

            if (!mi || !mi.is_active) {
              goneFromChain = true;
              availability = 'no_product';
            } else if (omi && !omi.is_listed) {
              availability = 'no_product';
            } else if (omi && !omi.in_stock) {
              availability = 'no_stock';
            }

            return {
              menu_item_id: item.menu_item_id,
              name: mi ? mi.name : item.name_snapshot,
              qty: item.qty,
              price_minor: goneFromChain ? null : mi ? mi.price_minor : null,
              image_url: mi ? mi.image_url : null,
              availability,
              options: (item.options || []).map((o: any) => ({
                name: o.name_snapshot,
                price_delta_minor: o.price_delta_minor_snapshot,
              })),
            };
          });

          lastOrderPayload = {
            placed_at: lastOrder?.placed_at,
            outlet_name: lastOrder?.outlet?.name || outlet.name,
            items: resolvedItems,
          };
        }
      }

      recognitionPayload = {
        order_count: profile.order_count,
        last_order: lastOrderPayload,
      };
    }

    // 4. Query Running Tab (table_sessions)
    let sessionPayload = null;
    const { data: activeSession } = await supabase
      .from('table_sessions')
      .select('*')
      .eq('outlet_id', outlet.id)
      .eq('table_label', tableLabel)
      .eq('status', 'open')
      .maybeSingle();

    if (activeSession) {
      const { data: sessionOrders } = await supabase
        .from('orders')
        .select(`
          id, diner_profile_id, status,
          items:order_items(
            name_snapshot, qty, price_minor_snapshot,
            options:order_item_options(price_delta_minor_snapshot)
          )
        `)
        .eq('session_id', activeSession.id)
        .neq('status', 'cancelled');

      if (sessionOrders && sessionOrders.length > 0) {
        let totalMinor = 0;
        const itemsRollup: any[] = [];

        sessionOrders.forEach((ord: any) => {
          const isMine = profile && ord.diner_profile_id === profile.id;
          (ord.items || []).forEach((it: any) => {
            const optionsDelta = (it.options || []).reduce(
              (acc: number, opt: any) => acc + (opt.price_delta_minor_snapshot || 0),
              0
            );
            const lineTotal = it.qty * (it.price_minor_snapshot + optionsDelta);
            totalMinor += lineTotal;

            itemsRollup.push({
              name: it.name_snapshot,
              qty: it.qty,
              line_total_minor: lineTotal,
              mine: isMine,
            });
          });
        });

        sessionPayload = {
          id: activeSession.id,
          opened_at: activeSession.opened_at,
          table_label: tableLabel,
          order_count: sessionOrders.length,
          total_minor: totalMinor,
          items: itemsRollup,
        };
      }
    }

    // 5. Fetch Menu Categories, Items, and Options
    const { data: categories } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('chain_id', chain.id)
      .order('position', { ascending: true });

    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')
      .eq('chain_id', chain.id)
      .eq('is_active', true)
      .eq('image_ready', true)
      .order('position', { ascending: true });

    const { data: outletOverrides } = await supabase
      .from('outlet_menu_items')
      .select('*')
      .eq('outlet_id', outlet.id);

    const overridesMap = new Map((outletOverrides || []).map((o: any) => [o.menu_item_id, o]));

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
          .map((opt: any) => ({
            id: opt.id,
            name: opt.name,
            price_delta_minor: opt.price_delta_minor,
            position: opt.position,
          })),
      });
      groupsMap.set(og.menu_item_id, list);
    });

    const formattedCategories = (categories || []).map((cat: any) => {
      const itemsInCategory = (menuItems || [])
        .filter((mi: any) => mi.category_id === cat.id)
        .map((mi: any) => {
          const override = overridesMap.get(mi.id);
          let availability = 'available';

          if (override) {
            if (!override.is_listed) availability = 'no_product';
            else if (!override.in_stock) availability = 'no_stock';
          }

          return {
            id: mi.id,
            name: mi.name,
            description: mi.description,
            price_minor: mi.price_minor,
            currency: mi.currency || 'NGN',
            image_url: mi.image_url,
            position: mi.position,
            availability,
            option_groups: groupsMap.get(mi.id) || [],
          };
        });

      return {
        id: cat.id,
        name: cat.name,
        position: cat.position,
        items: itemsInCategory,
      };
    });

    return new Response(
      JSON.stringify({
        device: { token: deviceRes.token, is_new: deviceRes.isNew },
        chain: {
          id: chain.id,
          name: chain.name,
          display_name: chain.display_name,
          logo_url: chain.logo_url,
          accent: chain.accent_hex,
          accent_ink: chain.accent_ink,
        },
        outlet: {
          id: outlet.id,
          slug: outlet.slug,
          name: outlet.name,
          is_open: true,
          timezone: outlet.timezone,
          table_label: tableLabel,
        },
        menu: {
          categories: formattedCategories,
        },
        session: sessionPayload,
        recognition: recognitionPayload,
      }),
      { headers: responseHeaders, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: { code: 'internal', message: (error as Error).message } }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
