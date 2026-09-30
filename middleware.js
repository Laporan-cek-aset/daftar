import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Kunci rahasia ini harus sama persis dengan yang ada di lib/session.js
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'kunci-rahasia-kkgmi-10');

export async function middleware(request) {
  // Ambil token langsung dari cookies request
  const token = request.cookies.get('session')?.value;
  const url = request.nextUrl.clone();

  // Jika user mencoba mengakses halaman dashboard
  if (url.pathname.startsWith('/dashboard')) {
    if (!token) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    
    // Verifikasi validitas token JWT
    try {
      await jwtVerify(token, secretKey);
      return NextResponse.next();
    } catch (error) {
      // Jika token kedaluwarsa atau tidak valid, kembalikan ke login
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Jika user berada di halaman depan tapi sudah login, arahkan ke dashboardnya
  if (url.pathname === '/' && token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      url.pathname = `/dashboard/${payload.role.toLowerCase()}`;
      return NextResponse.redirect(url);
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Hanya jalankan middleware ini di halaman depan dan dashboard (abaikan file statis/gambar)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|template).*)'],
};
