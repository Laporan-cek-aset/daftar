export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export default async function KelolaPengumuman() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return <div>Akses Ditolak</div>;

  const announcements = await db.execute('SELECT * FROM Announcements ORDER BY created_at DESC');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#064e3b]">Kelola Papan Pengumuman</h1>
        <p className="text-emerald-600 font-medium mt-2">Buat pengumuman interaktif (Popup) untuk para guru.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50 mb-10">
        <h2 className="text-xl font-bold text-[#064e3b] mb-4">Buat Pengumuman Baru</h2>
        <form action="/api/announcement/create" method="POST" className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#064e3b] mb-1">Judul Pengumuman</label>
            <input type="text" name="title" required className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Jadwal Tryout Diundur" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#064e3b] mb-1">Isi Pesan</label>
            <textarea name="content" required rows="4" className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Tulis detail pengumuman di sini..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#064e3b] mb-1">Link Lampiran Gambar / File (Opsional)</label>
            <p className="text-xs text-gray-500 mb-2">Jika Anda memasukkan link Google Drive, tombol "Unduh File" akan otomatis muncul di popup.</p>
            <input type="url" name="image_url" className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="https://drive.google.com/... atau https://contoh.com/gambar.jpg" />
          </div>
          <button type="submit" className="w-full bg-[#fbbf24] text-[#064e3b] font-extrabold py-3.5 rounded-xl hover:bg-[#f59e0b] transition-colors shadow-md mt-4 border-b-4 border-[#d97706] active:translate-y-1 active:border-b-0">
            Terbitkan Pengumuman
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50">
        <h2 className="text-xl font-bold text-[#064e3b] mb-4">Riwayat Pengumuman</h2>
        {announcements.rows.length === 0 ? (
           <p className="text-gray-500 italic">Belum ada pengumuman yang diterbitkan.</p>
        ) : (
           <div className="space-y-4">
             {announcements.rows.map((item) => (
               <div key={item.id} className="border-b border-gray-100 pb-4 flex justify-between items-center">
                 <div>
                   <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                   <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                 </div>
                 <form action="/api/announcement/delete" method="POST">
                   <input type="hidden" name="id" value={item.id} />
                   <button type="submit" className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition">Hapus</button>
                 </form>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
