import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseServiceClient } from '../_shared/supabase.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseServiceClient();
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: 'Missing order_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, subtotal_minor, chain_id, status, payment_status')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (order.payment_status === 'paid') {
      return new Response(JSON.stringify({ error: 'Order already paid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1% platform fee calculation
    const platform_fee_minor = Math.floor(order.subtotal_minor * 0.01);
    const total_amount_minor = order.subtotal_minor + platform_fee_minor;

    // Update order with the platform fee
    await supabase
      .from('orders')
      .update({ platform_fee_minor })
      .eq('id', order_id);

    // Call Moniepoint API (Mocked for now)
    const checkoutUrl = `https://checkout.moniepoint.com/mock?ref=${order_id}&amt=${total_amount_minor}`;

    return new Response(JSON.stringify({ 
      checkout_url: checkoutUrl, 
      total_amount_minor,
      platform_fee_minor 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
