import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
// Endpoint ini dapat disesuaikan untuk memproses form-data Excel menggunakan xlsx
// atau menyimpan file bukti bayar ke public/uploads

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  }

  // Proses file di sini (simpan ke Vercel Blob/AWS S3 atau parsing langsung)
  return NextResponse.json({ success: true, message: 'File berhasil diunggah' });
}
