import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  try {
    const session = await getSession();
    
    if (!session || (session.role !== 'guru' && session.Role !== 'guru')) {
       return NextResponse.redirect(new URL('/', request.url), 303);
    }

    const formData = await request.formData();
    const jumlah_siswa = parseInt(formData.get('jumlah_siswa'), 10);

    if (isNaN(jumlah_siswa) || jumlah_siswa < 1) {
       return NextResponse.json({ error: "Jumlah siswa tidak valid." }, { status: 400 });
    }

    const total_bayar = jumlah_siswa * 15000;
    
    // Mendukung penamaan dari objek sesi (case-safe)
    const guruId = session.id || session.ID;

    // Insert ke tabel Payments
    await db.execute({
      sql: "INSERT INTO Payments (guru_id, jumlah_siswa, total_bayar, bukti_bayar, status) VALUES (?, ?, ?, ?, 'Pending')",
      args: [guruId, jumlah_siswa, total_bayar, 'Belum Upload Bukti']
    });

    // Kembali ke dashboard guru dengan kode 303 (See Other) agar browser me-refresh sebagai metode GET
    return NextResponse.redirect(new URL('/dashboard/guru', request.url), 303);
    
  } catch (error) {
    console.error("Payment API Error:", error);
    // Mengembalikan halaman peringatan yang rapi daripada layar putih Error 500
    return new NextResponse(
      `<div style="font-family:sans-serif; text-align:center; padding: 50px;">
        <h2 style="color:red;">Gagal Membuat Tagihan</h2>
        <p>Terjadi kesalahan saat menyimpan data ke database. Silakan kembali dan coba lagi.</p>
        <p style="color:gray; font-size:12px;">Error Log: ${error.message}</p>
        <a href="/dashboard/guru" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#fbbf24; color:#064e3b; text-decoration:none; border-radius:5px; font-weight:bold;">Kembali ke Dashboard</a>
      </div>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
