export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import AuthForms from '@/components/AuthForms';
import AnnouncementList from '@/components/AnnouncementList';
import AdminView from '@/components/AdminView';
import UploadExcelComponent from '@/components/UploadExcelComponent';

export default async function MasterPage() {
  const session = await getSession();

  // ==========================================
  // 1. JIKA BELUM LOGIN (LANDING PAGE)
  // ==========================================
  if (!session) {
    let announcements = { rows: [] };
    try { announcements = await db.execute('SELECT * FROM Announcements ORDER BY created_at DESC'); } catch (e) {}

    return (
      <div className="min-h-screen flex flex-col bg-[#f4f7f4] font-sans text-gray-800">
        <header className="bg-[#064e3b] shadow-lg border-b-[6px] border-[#d97706] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                 <span className="text-lg sm:text-xl font-extrabold text-[#064e3b] tracking-wider">TKA</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-3xl font-extrabold text-[#fcd34d] tracking-wide drop-shadow-sm">Tryout TKA KKGMI</h1>
                <p className="text-emerald-100 font-medium tracking-widest text-xs sm:text-sm uppercase">Surabaya 10</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex flex-col md:flex-row gap-6 sm:gap-10">
          <section className="w-full md:w-2/3 flex flex-col">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-100 overflow-hidden flex flex-col h-full max-h-[75vh]">
              <div className="bg-gradient-to-r from-[#064e3b] to-[#047857] text-white p-4 sm:p-6 border-b-4 border-[#fbbf24] flex items-center gap-3">
                 <span className="text-xl sm:text-2xl">📢</span>
                 <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-[#fcd34d]">Papan Pengumuman</h2>
              </div>
              <div className="p-4 sm:p-8 overflow-y-auto bg-gray-50/50 flex-grow">
                 <AnnouncementList announcements={announcements.rows} />
              </div>
            </div>
          </section>
          <section className="w-full md:w-1/3"><AuthForms /></section>
        </main>
        
        <footer className="bg-[#064e3b] mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 text-center text-emerald-50">
            <p className="font-extrabold tracking-[0.3em] uppercase text-xs sm:text-sm mb-3 text-[#d97706]">Belajar Inovasi</p>
            <div className="w-12 sm:w-16 h-1 bg-[#fbbf24] mx-auto mb-4 rounded-full"></div>
            <p className="text-emerald-300 text-xs sm:text-sm font-medium">© {new Date().getFullYear()} KKGMI Surabaya 10. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ==========================================
  // 2. JIKA ADMIN LOGIN
  // ==========================================
  const isGuru = session.role === 'guru' || session.Role === 'guru';
  
  if (!isGuru) {
    const pendingPayments = await db.execute(`SELECT p.id, u.Nama, u.Sekolah, p.jumlah_siswa, p.total_bayar FROM Payments p JOIN Users u ON p.guru_id = u.ID WHERE p.status = 'Pending' ORDER BY p.created_at DESC`);
    const schools = await db.execute(`SELECT Sekolah, COUNT(ID) as jumlah_siswa FROM Users WHERE Role = 'siswa' AND Sekolah != '' AND Sekolah IS NOT NULL GROUP BY Sekolah ORDER BY jumlah_siswa DESC`);
    const announcements = await db.execute('SELECT * FROM Announcements ORDER BY created_at DESC');

    return <AdminView session={session} pendingPayments={pendingPayments.rows} schools={schools.rows} announcements={announcements.rows} />;
  }

  // ==========================================
  // 3. JIKA GURU LOGIN
  // ==========================================
  const userCheck = await db.execute({ sql: 'SELECT Sekolah FROM Users WHERE ID = ? OR Username = ?', args: [session.id, session.username] });
  const sekolahGuru = userCheck.rows[0]?.Sekolah || '';
  
  const paymentCheck = await db.execute({ sql: 'SELECT * FROM Payments WHERE guru_id = ? ORDER BY created_at DESC LIMIT 1', args: [session.id] });
  const payment = paymentCheck.rows[0];

  const studentsCheck = await db.execute({ sql: "SELECT ID, Nama, Username, Password, Kelas FROM Users WHERE Role = 'siswa' AND Sekolah = ?", args: [sekolahGuru] });
  const students = studentsCheck.rows || [];

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-[#064e3b] text-white flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 border-b border-emerald-700/50">
          <div className="w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-xl flex items-center justify-center border border-white mb-4"><span className="text-sm font-extrabold text-[#064e3b]">TKA</span></div>
          <h2 className="text-xl font-extrabold text-[#fcd34d]">Portal Guru</h2>
          <p className="text-sm text-emerald-200 mt-1 font-medium truncate">{session.username}</p>
        </div>
        <nav className="flex-1 p-4"><div className="block px-4 py-3 bg-[#047857] rounded-xl text-[#fcd34d] font-bold shadow-sm border-l-4 border-[#fbbf24]">🏠 Dashboard</div></nav>
        <div className="p-4 border-t border-emerald-700/50">
          <form action="/api/logout" method="POST"><button type="submit" className="w-full text-left px-4 py-3 text-red-300 hover:bg-emerald-800 hover:text-red-200 rounded-xl font-bold">Keluar Sistem</button></form>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto w-full">
        <div className="max-w-5xl mx-auto w-full">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b]">Selamat Datang, Pendamping!</h1>
            <p className="text-sm sm:text-base text-emerald-600 font-medium mt-2">Kelola pendaftaran siswa dari <strong className="text-[#d97706]">{sekolahGuru}</strong>.</p>
          </div>
          
          {!payment ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#fbbf24]"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#064e3b] mb-4">Langkah 1: Pembayaran Tryout</h2>
              <div className="bg-amber-50 p-4 rounded-xl mb-6 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2">📌 Informasi Pembayaran:</h3>
                <ul className="list-disc ml-5 text-amber-800 text-xs sm:text-sm font-medium space-y-1">
                  <li>Biaya pendaftaran per siswa: <strong>Rp 15.000</strong>.</li>
                  <li>Masukkan total siswa yang akan ikut untuk membuat tagihan otomatis.</li>
                </ul>
              </div>
              <form action="/api/payment" method="POST" className="space-y-4 bg-emerald-50/50 p-4 sm:p-6 rounded-2xl border border-emerald-100">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#064e3b] mb-2">Jumlah Siswa yang didaftarkan:</label>
                  <input type="number" name="jumlah_siswa" min="1" className="border-2 border-emerald-200 px-4 py-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]" placeholder="Cth: 20" required />
                </div>
                <button type="submit" className="w-full bg-[#fbbf24] text-[#064e3b] font-extrabold py-3.5 rounded-xl hover:bg-[#f59e0b] shadow-md border-b-4 border-[#d97706] active:translate-y-1 active:border-b-0 text-sm sm:text-base">Buat Tagihan Pembayaran</button>
              </form>
            </div>
          ) : payment.status === 'Pending' ? (
            <div className="bg-amber-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-amber-800 border-2 border-amber-200 shadow-sm">
              <h2 className="font-extrabold text-xl sm:text-2xl mb-4 text-amber-900">Langkah 2: Konfirmasi Pembayaran</h2>
              <p className="font-medium text-base sm:text-lg mb-4">Total Tagihan: <strong className="text-xl sm:text-2xl text-red-600">Rp {payment.total_bayar.toLocaleString('id-ID')}</strong> untuk <strong>{payment.jumlah_siswa} Siswa</strong>.</p>
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-amber-200 mb-6 shadow-sm">
                 <p className="font-bold text-gray-800 mb-2 text-sm sm:text-base">1. Transfer nominal di atas ke rekening berikut:</p>
                 <div className="bg-gray-100 p-3 sm:p-4 rounded-lg font-mono text-base sm:text-lg text-[#064e3b] mb-4"><strong>Bank BSI:</strong> 7128198878 <span className="text-xs sm:text-sm">(a.n KHOTIMAH)</span></div>
                 <p className="font-bold text-gray-800 mb-2 text-sm sm:text-base">2. Kirim bukti transfer via WhatsApp ke Admin:</p>
                 <a href={`https://wa.me/6285895283075?text=Halo%20Admin%20Tryout,%20saya%20dari%20${encodeURIComponent(sekolahGuru)}.%20Ini%20bukti%20transfer%20untuk%20${payment.jumlah_siswa}%20siswa%20sebesar%20Rp%20${payment.total_bayar.toLocaleString('id-ID')}.`} target="_blank" rel="noopener noreferrer" className="inline-flex bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-extrabold shadow-md text-sm sm:text-base">
                    Kirim Bukti via WhatsApp
                 </a>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#10b981]"></div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#059669]">Akses Pendaftaran Terbuka</h2>
                <a href="/template/Users.xlsx" download className="bg-emerald-100 text-emerald-800 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-sm hover:bg-emerald-200 font-bold border border-emerald-200 text-sm sm:text-base text-center w-full sm:w-auto">📥 Unduh Template</a>
              </div>
              <UploadExcelComponent sekolahGuru={sekolahGuru} studentsData={students} limit={payment.jumlah_siswa} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
