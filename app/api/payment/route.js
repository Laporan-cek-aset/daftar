import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.redirect(new URL('/', request.url), 303);

    const formData = await request.formData();
    const jumlah_siswa = parseInt(formData.get('jumlah_siswa'), 10);

    if (isNaN(jumlah_siswa) || jumlah_siswa < 1) {
       throw new Error("Jumlah siswa tidak valid.");
    }

    const total_bayar = jumlah_siswa * 15000;
    
    // Ambil ID Guru yang paling valid langsung dari database
    const userCheck = await db.execute({
      sql: 'SELECT ID FROM Users WHERE Username = ?',
      args: [session.username]
    });

    if (!userCheck.rows || userCheck.rows.length === 0) {
      throw new Error("Akun guru tidak ditemukan di database.");
    }

    const validGuruId = userCheck.rows[0].ID || userCheck.rows[0].id;

    // Insert ke tabel Payments
    await db.execute({
      sql: "INSERT INTO Payments (guru_id, jumlah_siswa, total_bayar, bukti_bayar, status) VALUES (?, ?, ?, ?, 'Pending')",
      args: [validGuruId, jumlah_siswa, total_bayar, 'Belum Upload Bukti']
    });

    return NextResponse.redirect(new URL('/', request.url), 303);
    
  } catch (error) {
    console.error("Payment API Error:", error);
    return new NextResponse(
      `<div style="font-family:sans-serif; text-align:center; padding: 50px;">
        <h2 style="color:red;">Gagal Membuat Tagihan</h2>
        <p>Terjadi kesalahan: ${error.message}</p>
        <a href="/dashboard/guru" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#fbbf24; color:#064e3b; text-decoration:none; border-radius:5px; font-weight:bold;">Kembali ke Dashboard</a>
      </div>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
