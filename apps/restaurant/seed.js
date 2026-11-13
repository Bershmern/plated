const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hbfvcoeognbhwkfybohn.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function run() {
  try {
    const chainId = '11111111-1111-1111-1111-111111111111';
    
    let { data: outlet } = await supabase.from('outlets').select('id').eq('chain_id', chainId).limit(1).single();
    let { data: diner } = await supabase.from('diner_profiles').select('id').limit(1).single();
    let { data: menuItems } = await supabase.from('menu_items').select('id, name, price_minor').eq('chain_id', chainId);
    let { data: session } = await supabase.from('table_sessions').select('id').limit(1).single();

    const statuses = ['delivered', 'delivered', 'delivered', 'delivered', 'incoming', 'incoming', 'processing'];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const date = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      const idempotencyKey = crypto.randomUUID();
      
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        chain_id: chainId,
        outlet_id: outlet.id,
        session_id: session.id,
        diner_profile_id: diner.id,
        status: status, 
        subtotal_minor: 0, 
        total_minor: 0,
        placed_at: date.toISOString(),
        idempotency_key: idempotencyKey
      }).select('id').single();

      if (orderErr) throw orderErr;

      let total = 0;
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const item = menuItems[Math.floor(Math.random() * menuItems.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        total += item.price_minor * qty;
        
        await supabase.from('order_items').insert({
          order_id: order.id,
          menu_item_id: item.id,
          qty: qty,
          name_snapshot: item.name,
          price_minor_snapshot: item.price_minor
        });
      }

      await supabase.from('orders').update({ subtotal_minor: total, total_minor: total }).eq('id', order.id);
    }
    console.log('Seeded 50 orders!');
  } catch(e) {
    console.error(e);
  }
}
run();
