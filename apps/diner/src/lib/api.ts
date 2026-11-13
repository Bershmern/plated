export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function scanOutlet(outletSlug: string, tableLabel: string) {
  const mirrorToken = typeof window !== 'undefined' ? localStorage.getItem('dt.v1') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (mirrorToken) {
    headers['X-Device-Token-Mirror'] = mirrorToken;
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/scan?outlet=${outletSlug}&t=${tableLabel}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to load menu');
  }

  const data = await response.json();
  
  if (data.device && data.device.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dt.v1', data.device.token);
    }
  }

  return data;
}

export async function placeOrder(
  outletId: string, 
  tableLabel: string, 
  items: any[], 
  idempotencyKey: string,
  fulfillmentType: string = 'dine_in',
  customerName?: string,
  customerPhone?: string,
  deliveryAddress?: string
) {
  const mirrorToken = typeof window !== 'undefined' ? localStorage.getItem('dt.v1') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  };

  if (mirrorToken) {
    headers['X-Device-Token-Mirror'] = mirrorToken;
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      outlet_id: outletId,
      table_label: tableLabel,
      items,
      fulfillment_type: fulfillmentType,
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_address: deliveryAddress
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to place order');
  }

  const data = await response.json();
  
  if (data.device && data.device.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dt.v1', data.device.token);
    }
  }

  return data;
}
