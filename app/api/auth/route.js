import { db } from '@/lib/db';
import { createSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const result = await db.execute({
      sql: 'SELECT * FROM Users WHERE Username = ? AND Password = ?',
      args: [username, password]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Username atau Password salah' }, { status: 401 });
    }

    const user = result.rows[0];
    if (user.Role !== 'guru' && user.Role !== 'admin') {
      return NextResponse.json({ error: 'Hanya Guru dan Admin yang dapat login' }, { status: 403 });
    }

    await createSession(user);
    return NextResponse.json({ success: true, role: user.Role });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
