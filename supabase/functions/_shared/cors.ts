export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, idempotency-key, x-device-token-mirror',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Expose-Headers': 'Set-Cookie',
};
