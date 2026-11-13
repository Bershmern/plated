import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const chainId = '11111111-1111-1111-1111-111111111111';
    
    let { data: outlet } = await supabase.from('outlets').select('id').eq('chain_id', chainId).limit(1).single();
    if (!outlet) {
      const { data: newOutlet, error: err } = await supabase.from('outlets').insert({
        id: '22222222-2222-2222-2222-222222222222',
        chain_id: chainId,
        name: 'Lagos Island Branch',
        slug: 'lagos-island',
        address: '123 Victoria Island',
        phone: '0800000000',
        timezone: 'Africa/Lagos'
      }).select('id').single();
      if (err) throw err;
      outlet = newOutlet;
    }

    let { data: diner } = await supabase.from('diner_profiles').select('id').limit(1).single();
    if (!diner) {
      const { data: newDiner, error: err } = await supabase.from('diner_profiles').insert({
        phone: '+2348000000000'
      }).select('id').single();
      if (err) throw err;
      diner = newDiner;
    }
    
    let { data: menuItems } = await supabase.from('menu_items').select('id, name, base_price_minor').eq('outlet_id', outlet.id);
    if (!menuItems || menuItems.length === 0) {
      const itemsToInsert = [
        { name: 'Jollof Rice & Chicken', base_price_minor: 450000, outlet_id: outlet.id, description: 'Classic Nigerian Jollof', is_available: true },
        { name: 'Suya Platter', base_price_minor: 350000, outlet_id: outlet.id, description: 'Spicy beef suya', is_available: true },
        { name: 'Egusi Soup with Pounded Yam', base_price_minor: 500000, outlet_id: outlet.id, description: 'Hearty egusi soup', is_available: true },
        { name: 'Fried Rice & Turkey', base_price_minor: 480000, outlet_id: outlet.id, description: 'Fried rice', is_available: true },
        { name: 'Zobo Drink', base_price_minor: 100000, outlet_id: outlet.id, description: 'Chilled zobo', is_available: true }
      ];
      const { data: insertedItems, error: err } = await supabase.from('menu_items').insert(itemsToInsert).select('id, name, base_price_minor');
      if (err) throw err;
      menuItems = insertedItems;
    }

    const statuses = ['completed', 'completed', 'completed', 'incoming', 'processing', 'ready'];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const date = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        chain_id: chainId,
        outlet_id: outlet.id,
        diner_profile_id: diner.id,
        fulfillment_type: 'dine_in',
        customer_name: 'Guest ' + i,
        status: status === 'completed' ? 'delivered' : status, 
        subtotal_minor: 0, 
        total_minor: 0,
        created_at: date.toISOString()
      }).select('id').single();

      if (orderErr) throw orderErr;

      let total = 0;
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const item = menuItems![Math.floor(Math.random() * menuItems!.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        total += item.base_price_minor * qty;
        
        await supabase.from('order_items').insert({
          order_id: order.id,
          menu_item_id: item.id,
          qty: qty,
          name_snapshot: item.name,
          price_minor_snapshot: item.base_price_minor
        });
      }

      await supabase.from('orders').update({ subtotal_minor: total, total_minor: total }).eq('id', order.id);
    }

    return NextResponse.json({ success: true, message: 'Seeded 20 orders' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Error seeding data' }, { status: 500 });
  }
}

