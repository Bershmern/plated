import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Check for local dev session cookie
  const devUserCookie = request.cookies.get('plated_dev_user');
  let devUser: { email?: string; role?: string; name?: string } | null = null;
  if (devUserCookie?.value) {
    try {
      devUser = JSON.parse(decodeURIComponent(devUserCookie.value));
    } catch {
      // ignore
    }
  }

  let user: { id: string; email?: string; role?: string } | null = null;

  if (devUser) {
    user = {
      id: '00000000-0000-0000-0000-000000000000',
      email: devUser.email || 'admin@gmail.com',
      role: devUser.role || 'admin',
    };
  } else {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
              supabaseResponse = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const res = await supabase.auth.getUser();
      user = res.data?.user as any;
    } catch {
      // In case Supabase network fails or is unreachable
      user = null;
    }
  }

  // If there's no user and the requested path is not /login or /api, redirect to /login
  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/api')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Enforce ADMIN role
  if (user && request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = user.email === 'admin@gmail.com' || devUser?.role === 'admin';
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // If there is a user and they are trying to access /login, redirect
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = (user.email === 'admin@gmail.com' || devUser?.role === 'admin') ? '/admin' : '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
