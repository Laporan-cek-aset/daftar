export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import UploadExcelComponent from './UploadExcelComponent';

export default async function DashboardGuru() {
  const session = await getSession();
  
  // Cek Status Pembayaran Guru ini
  const paymentCheck = await db.execute({
    sql: 'SELECT * FROM Payments WHERE guru_id = ? ORDER BY created_at DESC LIMIT 1',
    args: [session.id]
  });
  
  const payment = paymentCheck.rows[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#064e3b]">Selamat Datang, Pendamping!</h1>
        <p className="text-emerald-600 font-medium mt-2">Kelola pendaftaran siswa Tryout TKA KKGMI Surabaya 10 di sini.</p>
      </div>
      
      {!payment ? (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#fbbf24]"></div>
          <h2 className="text-2xl font-bold text-[#064e3b] mb-4">Langkah 1: Pembayaran Tryout</h2>
          <p className="text-gray-600 mb-6 font-medium">Biaya pendaftaran adalah <strong className="text-emerald-700">Rp 15.000 / Siswa</strong>.</p>
          
          <form action="/api/payment" method="POST" className="space-y-5 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <div>
              <label className="block text-sm font-bold text-[#064e3b] mb-2">Jumlah Siswa yang didaftarkan:</label>
              <input type="number" name="jumlah_siswa" min="1" className="border-2 border-emerald-200 px-4 py-3 w-full rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] outline-none font-bold text-lg" placeholder="Cth: 20" required />
            </div>
            <button type="submit" className="w-full bg-[#fbbf24] border-b-4 border-[#d97706] hover:bg-[#f59e0b] hover:border-[#b45309] text-[#064e3b] font-extrabold py-3.5 rounded-xl transition-all shadow-md active:translate-y-1 active:border-b-0">
              Buat Tagihan Pembayaran
            </button>
          </form>
        </div>
      ) : payment.status === 'Pending' ? (
        <div className="bg-amber-50 p-8 rounded-3xl text-amber-800 border-2 border-amber-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
               <span className="text-2xl">⏳</span>
             </div>
             <h2 className="font-extrabold text-2xl">Verifikasi Pembayaran</h2>
          </div>
          <p className="font-medium text-lg mb-2">Total Tagihan: <strong className="text-amber-900">Rp {payment.total_bayar.toLocaleString('id-ID')}</strong> ({payment.jumlah_siswa} Siswa)</p>
          <p className="opacity-80">Admin sedang memvalidasi pembayaran Anda. Silakan hubungi admin via WhatsApp dan *refresh* halaman ini secara berkala.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#10b981]"></div>
          <h2 className="text-2xl font-extrabold text-[#059669] mb-4 flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Akses Pendaftaran Terbuka
          </h2>
          <p className="mb-6 font-medium text-gray-600">Pembayaran untuk <strong className="text-[#064e3b]">{payment.jumlah_siswa} siswa</strong> telah disetujui. Silakan unduh template Excel di bawah ini, isi data siswa, dan unggah kembali.</p>
          
          <a href="/template/Users.xlsx" download className="inline-flex bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl shadow-sm hover:bg-emerald-200 font-bold transition-colors border border-emerald-200">
            📥 Unduh Template Excel
          </a>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <UploadExcelComponent />
          </div>
        </div>
      )}
    </div>
  );
}
