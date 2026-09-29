import LoginForm from '@/components/LoginForm';
import { db } from '@/lib/db';

export default async function LandingPage() {
  // Ambil pengumuman dari Turso (Admin bisa post gambar/teks)
  const announcements = await db.execute('SELECT * FROM Announcements ORDER BY created_at DESC');

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 font-sans">
      {/* Header dengan Logo */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-yellow-400">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
          <img src="https://lh3.googleusercontent.com/idgambar" alt="Logo KKGMI" className="h-14" />
          <h1 className="text-2xl font-extrabold text-blue-900">Tryout TKA KKGMI Surabaya 10</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row p-6 gap-8 max-w-7xl mx-auto w-full mt-4">
        {/* Sisi Kiri: Pengumuman */}
        <section className="md:w-2/3 bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 overflow-y-auto max-h-[75vh]">
           <h2 className="text-3xl font-bold mb-6 text-blue-800 flex items-center gap-2">
             📢 Papan Pengumuman
           </h2>
           <div className="space-y-6">
              {announcements.rows.length === 0 ? (
                <p className="text-gray-500 italic">Belum ada pengumuman saat ini.</p>
              ) : announcements.rows.map((item) => (
                <div key={item.id} className="border-b pb-6">
                  <h3 className="font-bold text-xl text-gray-800">{item.title}</h3>
                  {item.image_url && (
                    <img src={item.image_url} alt="Pengumuman" className="mt-3 rounded-lg max-h-80 w-full object-cover shadow-sm" />
                  )}
                  <p className="mt-3 text-gray-700 leading-relaxed">{item.content}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Sisi Kanan: Login & Daftar */}
        <section className="md:w-1/3">
           <LoginForm />
        </section>
      </main>

      {/* Tombol WhatsApp Melayang */}
      <a 
        href="https://wa.me/6285895283075?text=Halo%20Admin%20Tryout%20TKA%20KKGMI,%20saya%20butuh%20bantuan." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-green-600 transition-all z-50 flex items-center justify-center"
      >
         <span className="text-3xl">💬</span> {/* Bisa diganti icon WA */}
      </a>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center p-4 mt-auto">
        <p className="font-semibold tracking-widest uppercase">belajar inovasi</p>
      </footer>
    </div>
  );
}
