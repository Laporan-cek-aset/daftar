import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { nama, sekolah, username, password } = await request.json();
    
    // Cek apakah username sudah dipakai
    const check = await db.execute({
      sql: 'SELECT * FROM Users WHERE Username = ?',
      args: [username]
    });
    
    if (check.rows.length > 0) {
      return NextResponse.json({ error: 'Username ini sudah terdaftar. Silakan gunakan yang lain.' }, { status: 400 });
    }

    // Buat ID unik untuk guru
    const newId = 'GURU-' + Date.now();

    // Simpan ke database Turso
    await db.execute({
      sql: 'INSERT INTO Users (ID, Nama, Username, Password, Role, Sekolah, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [newId, nama, username, password, 'guru', sekolah, 'Offline']
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error register:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat mendaftar.' }, { status: 500 });
  }
}
