import { getSupabaseServiceClient } from './supabase.ts';

const HMAC_SECRET = Deno.env.get('HMAC_SECRET_KEY') || 'plated-dev-hmac-secret-key-change-in-prod';

async function hmacSign(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(HMAC_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function verifyToken(tokenString: string): Promise<{ deviceId: string; iat: number } | null> {
  try {
    const parts = tokenString.split('.');
    if (parts.length !== 4 || parts[0] !== 'v1') return null;

    const deviceId = parts[1];
    const iat = parseInt(parts[2], 10);
    const signature = parts[3];

    if (!deviceId || isNaN(iat) || !signature) return null;

    const expectedData = `v1.${deviceId}.${iat}`;
    const expectedSig = await hmacSign(expectedData);

    if (expectedSig !== signature) return null;

    return { deviceId, iat };
  } catch {
    return null;
  }
}

export async function createDeviceToken(deviceId?: string): Promise<{ token: string; deviceId: string }> {
  const id = deviceId || crypto.randomUUID();
  const iat = Math.floor(Date.now() / 1000);
  const payload = `v1.${id}.${iat}`;
  const sig = await hmacSign(payload);
  return { token: `${payload}.${sig}`, deviceId: id };
}

export interface DeviceResolutionResult {
  deviceId: string;
  token: string;
  isNew: boolean;
  cookieHeader: string;
}

export async function resolveDeviceIdentity(req: Request): Promise<DeviceResolutionResult> {
  const supabase = getSupabaseServiceClient();

  // Extract Cookie
  const cookieHeader = req.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const rawCookieToken = cookies['__Host-dt'];

  // Extract Mirror Header
  const rawMirrorToken = req.headers.get('X-Device-Token-Mirror');

  // Verify both
  const cookieVerified = rawCookieToken ? await verifyToken(rawCookieToken) : null;
  const mirrorVerified = rawMirrorToken ? await verifyToken(rawMirrorToken) : null;

  let selectedDeviceId: string;
  let isNew = false;

  if (cookieVerified) {
    // 1. Valid Cookie wins
    selectedDeviceId = cookieVerified.deviceId;
  } else if (mirrorVerified) {
    // 2. Cookie absent/invalid, Valid Mirror re-issues cookie from mirror's deviceId
    selectedDeviceId = mirrorVerified.deviceId;
  } else {
    // 3. Mint new identity
    selectedDeviceId = crypto.randomUUID();
    isNew = true;

    // Record new device in database
    await supabase.from('diner_devices').insert({
      id: selectedDeviceId,
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    });
  }

  // Create fresh signed token
  const { token } = await createDeviceToken(selectedDeviceId);

  // Touch last_seen_at asynchronously if not new
  if (!isNew) {
    supabase
      .from('diner_devices')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', selectedDeviceId)
      .then();
  }

  const setCookieValue = `__Host-dt=${token}; Max-Age=63072000; HttpOnly; Secure; Path=/; SameSite=Lax`;

  return {
    deviceId: selectedDeviceId,
    token,
    isNew,
    cookieHeader: setCookieValue,
  };
}
