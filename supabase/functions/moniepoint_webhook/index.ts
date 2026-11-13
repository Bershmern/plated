import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseServiceClient } from '../_shared/supabase.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseServiceClient();
    const event = await req.json();

    // In a real implementation, we would verify Moniepoint's webhook signature here
    // e.g. using crypto.subtle.verify or similar

    if (event.status === 'SUCCESSFUL' && event.reference) {
      // Find order by moniepoint_reference or id (depending on what was passed as ref)
      const order_id = event.reference;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, payment_status')
        .eq('id', order_id)
        .single();

      if (!orderError && order && order.payment_status === 'pending') {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', order_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
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
