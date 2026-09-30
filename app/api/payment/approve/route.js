import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));

  const formData = await request.formData();
  const payment_id = formData.get('payment_id');

  // Admin menyetujui pembayaran
  await db.execute({
    sql: "UPDATE Payments SET status = 'Disetujui' WHERE id = ?",
    args: [payment_id]
  });

  return NextResponse.redirect(new URL('/dashboard/admin', request.url), 303);
}
