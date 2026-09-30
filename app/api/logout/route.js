import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  // Hapus cookie sesi
  cookies().delete('session');
  // Redirect ke halaman login utama
  return NextResponse.redirect(new URL('/', request.url), 303);
}
