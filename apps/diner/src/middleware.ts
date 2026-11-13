import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isSecure = process.env.NODE_ENV === 'production' || request.nextUrl.protocol === 'https:';
  const cookieName = isSecure ? '__Host-dt' : 'dt';
  const existingCookie = request.cookies.get(cookieName)?.value;

  let deviceToken = existingCookie;
  if (!deviceToken) {
    deviceToken = crypto.randomUUID();
    // Set cookie dynamically based on environment
    response.cookies.set(cookieName, deviceToken, {
      path: '/',
      secure: isSecure,
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
