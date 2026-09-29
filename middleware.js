import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('user_token')?.value;
  const url = request.nextUrl.clone();

  // Jika mencoba akses dashboard tanpa login
  if (url.pathname.startsWith('/dashboard') && !token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Jika sudah login tapi coba akses landing page (Bisa di redirect ke dashboard masing-masing)
  if (url.pathname === '/' && token) {
    const role = request.cookies.get('user_role')?.value;
    url.pathname = `/dashboard/${role}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
