export const dynamic = 'force-dynamic';
import LoginForm from '@/components/LoginForm';
import AnnouncementList from '@/components/AnnouncementList';
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
      <header className="bg-[#064e3b] shadow-lg border-b-[6px] border-[#d97706] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5 w-full justify-center md:justify-start">
            <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-full flex items-center justify-center border-2 border-white shadow-md">
               <span className="text-xl font-extrabold text-[#064e3b] tracking-wider">TKA</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fcd34d] tracking-wide drop-shadow-sm">Tryout TKA KKGMI</h1>
              <p className="text-emerald-100 font-medium tracking-widest text-sm uppercase">Surabaya 10</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col md:flex-row gap-10">
        <section className="md:w-2/3 flex flex-col">
          <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden flex flex-col h-full max-h-[75vh]">
            <div className="bg-gradient-to-r from-[#064e3b] to-[#047857] text-white p-6 border-b-4 border-[#fbbf24] flex items-center gap-3">
               <span style={{ fontSize: '24px' }}>📢</span>
               <h2 className="text-2xl font-bold tracking-wide text-[#fcd34d]">Papan Pengumuman</h2>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50/50 flex-grow">
               {/* Memanggil komponen Popup */}
               <AnnouncementList announcements={announcements.rows} />
            </div>
          </div>
        </section>

        <section className="md:w-1/3">
           <LoginForm />
        </section>
      </main>

      <a href="https://wa.me/6285895283075" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 bg-gradient-to-r from-[#10b981] to-[#059669] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center border-2 border-white">
         <svg style={{ width: '32px', height: '32px' }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <footer className="bg-[#064e3b] mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-emerald-50">
          <p className="font-extrabold tracking-[0.3em] uppercase text-sm mb-3 text-[#d97706]">Belajar Inovasi</p>
          <div className="w-16 h-1 bg-[#fbbf24] mx-auto mb-4 rounded-full"></div>
          <p className="text-emerald-300 text-sm font-medium">© {new Date().getFullYear()} KKGMI Surabaya 10. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
