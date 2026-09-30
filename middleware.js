import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Keamanan sudah dijaga ketat di dalam app/page.jsx (Server Component)
  return NextResponse.next();
}
