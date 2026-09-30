import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));

  const formData = await request.formData();
  const id = formData.get('id');

  await db.execute({
    sql: "DELETE FROM Announcements WHERE id = ?",
    args: [id]
  });

  return NextResponse.redirect(new URL('/?menu=pengumuman', request.url), 303);
}
