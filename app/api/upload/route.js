import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'guru') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { students, sekolah } = await request.json();

    if (!students || students.length === 0) {
      return NextResponse.json({ error: 'Data Excel kosong.' }, { status: 400 });
    }

    // Ubah data siswa dari Excel menjadi perintah SQL insert masal
    const statements = students.map((s) => {
      const id = s.ID || 'S-' + Date.now() + Math.floor(Math.random() * 1000);
      const nama = s.Nama || s.nama || '';
      const username = s.Username || s.username || id;
      const password = s.Password || s.password || '123456';
      const kelas = s.Kelas || s.kelas || 'ALL';
      const tglLahir = s.TglLahir || s.tgllahir || '';
      
      return {
        sql: "INSERT OR IGNORE INTO Users (ID, Nama, Username, Password, Role, Sekolah, Kelas, TglLahir, Foto, Terjawab, TotalSoal, Status, Sesi) VALUES (?, ?, ?, ?, 'siswa', ?, ?, ?, '', 0, 0, 'Offline', 1)",
        args: [id, nama, username, password, sekolah, kelas, tglLahir]
      };
    });

    // Jalankan semua insert secara bersamaan menggunakan fungsi batch Turso
    await db.batch(statements);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Gagal memproses data ke database: ' + error.message }, { status: 500 });
  }
}
