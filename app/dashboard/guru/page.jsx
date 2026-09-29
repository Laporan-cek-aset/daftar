import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import UploadExcelComponent from './UploadExcelComponent';

export default async function DashboardGuru() {
  const userId = cookies().get('user_id')?.value;
  
  // Cek Status Pembayaran
  const paymentCheck = await db.execute('SELECT * FROM Payments WHERE guru_id = ?', [userId]);
  const payment = paymentCheck.rows[0];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Dashboard Guru</h1>
      
      {!payment ? (
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold mb-4">Langkah 1: Pembayaran Tryout</h2>
          <p className="text-gray-600 mb-4">Biaya pendaftaran adalah <strong>Rp 15.000 / Siswa</strong>.</p>
          <form action="/api/payment" method="POST" className="space-y-4">
            <input type="hidden" name="guru_id" value={userId} />
            <div>
              <label className="block text-sm font-bold">Jumlah Siswa yang didaftarkan:</label>
              <input type="number" name="jumlah_siswa" min="1" className="border p-2 w-full rounded" required />
            </div>
            {/* Logic upload bukti bayar diletakkan di sini */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Kirim Bukti Bayar</button>
          </form>
        </div>
      ) : payment.status === 'Pending' ? (
        <div className="bg-yellow-100 p-6 rounded-xl text-yellow-800 border-l-4 border-yellow-500">
          <h2 className="font-bold text-lg">Pembayaran Sedang Diverifikasi</h2>
          <p>Admin sedang memvalidasi pembayaran Anda. Silakan cek secara berkala (Refresh).</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-green-700 mb-4">Pembayaran Disetujui!</h2>
          <p className="mb-4">Silakan unduh template Excel di bawah ini, isi data siswa, dan unggah kembali.</p>
          
          <div className="flex gap-4">
            <a href="/template/Users.xlsx" download className="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow hover:bg-blue-200 font-bold">
              📥 Unduh Template Excel
            </a>
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-2">Unggah Data Siswa:</h3>
            <UploadExcelComponent /> {/* Komponen Client-side untuk baca Excel */}
          </div>
        </div>
      )}
    </div>
  );
}
