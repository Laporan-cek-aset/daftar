export const dynamic = 'force-dynamic';
import LoginForm from '@/components/LoginForm';
import { db } from '@/lib/db';

export default async function LandingPage() {
  let announcements = { rows: [] };
  try {
    announcements = await db.execute('SELECT * FROM Announcements ORDER BY created_at DESC');
  } catch (error) {
    console.error("Gagal mengambil pengumuman:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f4] font-sans text-gray-800">
      
      {/* Header Elegan: Hijau Gelap & Emas */}
      <header className="bg-[#064e3b] shadow-lg border-b-[6px] border-[#d97706] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5 w-full justify-center md:justify-start">
            <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-full flex items-center justify-center border-2 border-white shadow-md">
               <span className="text-xl font-extrabold text-[#064e3b] tracking-wider">TKA</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fcd34d] tracking-wide drop-shadow-sm">
                Tryout TKA KKGMI
              </h1>
              <p className="text-emerald-100 font-medium tracking-widest text-sm uppercase">Surabaya 10</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col md:flex-row gap-10">
        
        {/* Kolom Kiri: Papan Pengumuman */}
        <section className="md:w-2/3 flex flex-col">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-emerald-100 overflow-hidden flex flex-col h-full max-h-[75vh]">
            <div className="bg-gradient-to-r from-[#064e3b] to-[#047857] text-white p-6 border-b-4 border-[#fbbf24] flex items-center gap-3">
               <span style={{ fontSize: '24px' }}>📢</span>
               <h2 className="text-2xl font-bold tracking-wide text-[#fcd34d]">Papan Pengumuman</h2>
            </div>
            
            <div className="p-8 overflow-y-auto bg-gray-50/50 flex-grow">
               {announcements.rows.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-48 text-center opacity-70">
                   <svg style={{ width: '64px', height: '64px' }} className="text-emerald-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                   <p className="text-emerald-800 font-semibold text-lg">Belum ada pengumuman saat ini.</p>
                 </div>
               ) : (
                 <div className="space-y-8">
                   {announcements.rows.map((item) => (
                     <article key={item.id} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition duration-300">
                       <h3 className="font-extrabold text-2xl text-[#064e3b] mb-2">{item.title}</h3>
                       <span className="text-xs font-bold text-[#d97706] mb-5 block uppercase tracking-widest bg-amber-50 inline-block px-3 py-1 rounded-full">
                         {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                       </span>
                       {item.image_url && (
                         <img src={item.image_url} alt={item.title} className="mb-5 rounded-xl max-h-80 w-full object-cover border border-emerald-50" />
                       )}
                       <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                     </article>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </section>

        {/* Kolom Kanan: Login */}
        <section className="md:w-1/3">
           <LoginForm />
        </section>

      </main>

      {/* Tombol Bantuan Melayang (WhatsApp) - Ukuran Dikunci Aman */}
      <a 
        href="https://wa.me/6285895283075?text=Halo%20Admin%20Tryout%20TKA%20KKGMI,%20saya%20butuh%20bantuan." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#10b981] to-[#059669] text-white p-4 rounded-full shadow-[0_10px_25px_rgba(5,150,105,0.5)] hover:scale-110 transition-all z-50 flex items-center justify-center border-2 border-white"
      >
         {/* Inline style ditambahkan agar tidak pernah membengkak lagi */}
         <svg style={{ width: '32px', height: '32px' }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Footer Elegan */}
      <footer className="bg-[#064e3b] mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-emerald-50">
          <p className="font-extrabold tracking-[0.3em] uppercase text-sm mb-3 text-[#d97706]">Belajar Inovasi</p>
          <div className="w-16 h-1 bg-[#fbbf24] mx-auto mb-4 rounded-full"></div>
          <p className="text-emerald-300 text-sm font-medium">© {new Date().getFullYear()} KKGMI Surabaya 10. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
