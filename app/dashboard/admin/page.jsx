export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';

export default async function AdminDashboard() {
  // Mengambil data guru dan pembayaran yang statusnya Pending
  const pendingPayments = await db.execute(`
    SELECT p.id, u.Nama, u.Sekolah, p.jumlah_siswa, p.total_bayar 
    FROM Payments p JOIN Users u ON p.guru_id = u.ID 
    WHERE p.status = 'Pending'
    ORDER BY p.created_at DESC
  `);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#064e3b]">Verifikasi Pembayaran</h1>
        <p className="text-emerald-600 font-medium mt-2">Setujui pembayaran dari guru agar mereka dapat mengunggah data siswa.</p>
      </div>
      
      <div className="bg-white p-2 sm:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-emerald-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/50">
                <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Nama Guru</th>
                <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Sekolah</th>
                <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Siswa</th>
                <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Total Bayar</th>
                <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.rows.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-100 font-bold text-gray-800">{payment.Nama}</td>
                  <td className="p-4 border-b border-gray-100 text-gray-600 font-medium">{payment.Sekolah}</td>
                  <td className="p-4 border-b border-gray-100 font-bold text-emerald-600">
                    <span className="bg-emerald-100 px-3 py-1 rounded-full">{payment.jumlah_siswa}</span>
                  </td>
                  <td className="p-4 border-b border-gray-100 font-bold text-amber-600">Rp {payment.total_bayar.toLocaleString('id-ID')}</td>
                  <td className="p-4 border-b border-gray-100">
                    <form action="/api/payment/approve" method="POST">
                      <input type="hidden" name="payment_id" value={payment.id} />
                      <button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95">Setujui</button>
                    </form>
                  </td>
                </tr>
              ))}
              {pendingPayments.rows.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                     <span className="text-4xl block mb-3">📭</span>
                     <p className="text-gray-500 font-bold">Tidak ada tagihan pembayaran yang pending.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
