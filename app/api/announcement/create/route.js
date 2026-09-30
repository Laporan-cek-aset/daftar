import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));

  const formData = await request.formData();
  const title = formData.get('title');
  const content = formData.get('content');
  const image_url = formData.get('image_url') || null;

  await db.execute({
    sql: "INSERT INTO Announcements (title, content, image_url) VALUES (?, ?, ?)",
    args: [title, content, image_url]
  });

  return NextResponse.redirect(new URL('/dashboard/admin/pengumuman', request.url), 303);
}
