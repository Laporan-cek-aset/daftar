import { db } from '@/lib/db';
import { createSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. Validasi input kosong
    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan Password wajib diisi.' }, { status: 400 });
    }

    // 2. Cari user di database Turso
    const result = await db.execute({
      sql: 'SELECT * FROM Users WHERE Username = ?',
      args: [username]
    });

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Akun tidak ditemukan. Periksa kembali username Anda.' }, { status: 401 });
    }

    const user = result.rows[0];

    // 3. Cek Password (Mendukung perbedaan huruf besar/kecil kolom SQLite)
    const dbPassword = user.Password || user.password;
    if (dbPassword !== password) {
      return NextResponse.json({ error: 'Password yang Anda masukkan salah.' }, { status: 401 });
    }

    // 4. Cek Hak Akses
    const userRole = user.Role || user.role;
    if (userRole !== 'guru' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya Guru dan Admin yang dapat login.' }, { status: 403 });
    }

    // 5. Buat Sesi Login Berhasil
    await createSession(user);
    return NextResponse.json({ success: true, role: userRole });
    
  } catch (error) {
    // Memberikan pesan error spesifik jika terjadi crash di server/database
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Sistem Error: ' + (error.message || 'Gagal terhubung ke database.') }, { status: 500 });
  }
}
