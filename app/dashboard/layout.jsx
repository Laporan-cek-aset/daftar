import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  
  // Jika belum login, tendang ke halaman depan
  if (!session) {
    redirect('/');
  }

  const isGuru = session.role === 'guru';

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col md:flex-row font-sans">
      {/* Sidebar Hijau Elegan */}
      <aside className="w-full md:w-64 bg-[#064e3b] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-emerald-700/50">
          <div className="w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-xl flex items-center justify-center border border-white shadow-sm mb-4">
             <span className="text-sm font-extrabold text-[#064e3b]">TKA</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#fcd34d] tracking-wide">
            Portal {isGuru ? 'Guru' : 'Admin'}
          </h2>
          <p className="text-sm text-emerald-200 mt-1 font-medium truncate">
            {session.username}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href={`/dashboard/${session.role}`} className="block px-4 py-3 bg-[#047857] rounded-xl text-[#fcd34d] font-bold shadow-sm border-l-4 border-[#fbbf24]">
            🏠 Dashboard
          </a>
          {/* Menu Admin Tambahan (Opsional) */}
          {!isGuru && (
            <a href="/dashboard/admin/pengumuman" className="block px-4 py-3 hover:bg-emerald-800 rounded-xl text-emerald-100 font-medium transition-colors">
              📢 Kelola Pengumuman
            </a>
          )}
        </nav>

        <div className="p-4 border-t border-emerald-700/50">
          <form action="/api/logout" method="POST">
            <button type="submit" className="w-full text-left px-4 py-3 text-red-300 hover:bg-emerald-800 hover:text-red-200 rounded-xl font-bold transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Keluar Sistem
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
