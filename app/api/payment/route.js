import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'guru') return NextResponse.redirect(new URL('/', request.url));

  const formData = await request.formData();
  const jumlah_siswa = formData.get('jumlah_siswa');
  const total_bayar = parseInt(jumlah_siswa) * 15000;

  // Insert ke tabel Payments
  await db.execute({
    sql: "INSERT INTO Payments (guru_id, jumlah_siswa, total_bayar, bukti_bayar, status) VALUES (?, ?, ?, ?, 'Pending')",
    args: [session.id, jumlah_siswa, total_bayar, 'Belum Upload Bukti']
  });

  // Kembali ke dashboard guru (akan otomatis ter-refresh melihat status pending)
  return NextResponse.redirect(new URL('/dashboard/guru', request.url), 303);
}
