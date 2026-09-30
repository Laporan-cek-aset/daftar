export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import UploadExcelComponent from './UploadExcelComponent';

export default async function DashboardGuru() {
  const session = await getSession();
  
  const userCheck = await db.execute({
    sql: 'SELECT Sekolah FROM Users WHERE ID = ? OR Username = ?',
    args: [session.id, session.username]
  });
  const sekolahGuru = userCheck.rows[0]?.Sekolah || '';

  const paymentCheck = await db.execute({
    sql: 'SELECT * FROM Payments WHERE guru_id = ? ORDER BY created_at DESC LIMIT 1',
    args: [session.id]
  });
  const payment = paymentCheck.rows[0];

  const studentsCheck = await db.execute({
    sql: "SELECT ID, Nama, Username, Password, Kelas FROM Users WHERE Role = 'siswa' AND Sekolah = ?",
    args: [sekolahGuru]
  });
  const students = studentsCheck.rows || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#064e3b]">Selamat Datang, Pendamping!</h1>
        <p className="text-emerald-600 font-medium mt-2">Kelola pendaftaran siswa dari <strong className="text-[#d97706]">{sekolahGuru}</strong> di sini.</p>
      </div>
      
      {!payment ? (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#fbbf24]"></div>
          <h2 className="text-2xl font-bold text-[#064e3b] mb-4">Langkah 1: Pembayaran Tryout</h2>
          <div className="bg-amber-50 p-4 rounded-xl mb-6 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">📌 Informasi Pembayaran:</h3>
            <ul className="list-disc ml-5 text-amber-800 text-sm space-y-1 font-medium">
              <li>Biaya pendaftaran per siswa adalah <strong>Rp 15.000</strong>.</li>
              <li>Masukkan total siswa yang akan ikut, sistem akan otomatis menghitung tagihan.</li>
            </ul>
          </div>
          
          <form action="/api/payment" method="POST" className="space-y-5 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <div>
              <label className="block text-sm font-bold text-[#064e3b] mb-2">Jumlah Siswa yang didaftarkan:</label>
              <input type="number" name="jumlah_siswa" min="1" className="border-2 border-emerald-200 px-4 py-3 w-full rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] outline-none font-bold text-lg" placeholder="Cth: 20" required />
            </div>
            <button type="submit" className="w-full bg-[#fbbf24] border-b-4 border-[#d97706] hover:bg-[#f59e0b] text-[#064e3b] font-extrabold py-3.5 rounded-xl transition-all shadow-md active:translate-y-1 active:border-b-0">
              Buat Tagihan Pembayaran
            </button>
          </form>
        </div>
      ) : payment.status === 'Pending' ? (
        <div className="bg-amber-50 p-8 rounded-3xl text-amber-800 border-2 border-amber-200 shadow-sm relative overflow-hidden">
          <h2 className="font-extrabold text-2xl mb-4 text-amber-900">Langkah 2: Konfirmasi Pembayaran</h2>
          <p className="font-medium text-lg mb-4">Total Tagihan: <strong className="text-2xl text-red-600">Rp {payment.total_bayar.toLocaleString('id-ID')}</strong> untuk <strong>{payment.jumlah_siswa} Siswa</strong>.</p>
          
          <div className="bg-white p-6 rounded-xl border border-amber-200 mb-6 shadow-sm">
             <p className="font-bold text-gray-800 mb-2">1. Transfer nominal di atas ke rekening berikut:</p>
             <div className="bg-gray-100 p-4 rounded-lg font-mono text-lg text-[#064e3b] mb-4">
               <strong>Bank BSI:</strong> 7128198878 <br/> <span className="text-sm">(a.n KHOTIMAH)</span>
             </div>
             <p className="font-bold text-gray-800 mb-2">2. Kirim bukti transfer via WhatsApp ke Admin:</p>
             
             <a href={`https://wa.me/6285895283075?text=Halo%20Admin%20Tryout%20TKA,%20saya%20Guru%20dari%20${encodeURIComponent(sekolahGuru)}.%20Saya%20ingin%20mengirimkan%20bukti%20transfer%20untuk%20${payment.jumlah_siswa}%20siswa%20sebesar%20Rp%20${payment.total_bayar.toLocaleString('id-ID')}.`} 
                target="_blank" rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl font-extrabold shadow-md transition-all active:scale-95">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Kirim Bukti via WhatsApp
             </a>
          </div>
          <p className="text-sm opacity-80 italic">Refresh halaman ini setelah Admin menyetujui pembayaran Anda untuk membuka akses pendaftaran.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#10b981]"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#059669] flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Akses Pendaftaran Terbuka
            </h2>
            <a href="/template/Users.xlsx" download className="bg-emerald-100 text-emerald-800 px-5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-200 font-bold transition-colors border border-emerald-200 flex items-center gap-2">
              📥 Unduh Template Excel
            </a>
          </div>
          
          <UploadExcelComponent sekolahGuru={sekolahGuru} studentsData={students} limit={payment.jumlah_siswa} />
        </div>
      )}
    </div>
  );
}
