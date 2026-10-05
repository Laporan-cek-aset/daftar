import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, sekolah, username, password } = body;

    // 1. Validasi kelengkapan form
    if (!nama || !sekolah || !username || !password) {
       return NextResponse.json({ error: 'Semua kolom wajib diisi dengan lengkap.' }, { status: 400 });
    }

    // 2. Cek apakah username sudah ada agar tidak ganda
    const check = await db.execute({
      sql: 'SELECT * FROM Users WHERE Username = ?',
      args: [username]
    });

    if (check.rows && check.rows.length > 0) {
      return NextResponse.json({ error: 'Username ini sudah dipakai. Silakan gunakan username lain.' }, { status: 400 });
    }

    // 3. Insert data guru baru ke tabel
    const newId = 'GURU-' + Date.now();

    await db.execute({
      sql: 'INSERT INTO Users (ID, Nama, Username, Password, Role, Sekolah, Kelas, TglLahir, Foto, Terjawab, TotalSoal, Status, Sesi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [newId, nama, username, password, 'guru', sekolah, 'ALL', '', '', 0, 0, 'Offline', 1]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: 'Sistem Error: ' + (error.message || 'Gagal menyimpan pendaftaran.') }, { status: 500 });
  }
}
