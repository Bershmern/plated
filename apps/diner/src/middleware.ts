import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existingCookie = request.cookies.get('__Host-dt')?.value;

  let deviceToken = existingCookie;
  if (!deviceToken) {
    deviceToken = crypto.randomUUID();
    // Set __Host-dt cookie (Secure, SameSite=Lax, 1-year maxAge)
    response.cookies.set('__Host-dt', deviceToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // Mirror token in response header for client-side localStorage sync if needed
  response.headers.set('x-device-token-mirror', deviceToken);
  return response;
}

export const config = {
  matcher: ['/o/:path*', '/api/:path*'],
};
