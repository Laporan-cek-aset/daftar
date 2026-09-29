export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const pendingPayments = await db.execute(`
    SELECT p.id, u.Nama, u.Sekolah, p.jumlah_siswa, p.total_bayar, p.bukti_bayar 
    FROM Payments p JOIN Users u ON p.guru_id = u.ID 
    WHERE p.status = 'Pending'
  `);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-pendidikan-blue mb-6">Dashboard Admin - Verifikasi Pembayaran</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-pendidikan-blue">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Nama Guru</th>
              <th className="p-3 border-b">Sekolah</th>
              <th className="p-3 border-b">Siswa</th>
              <th className="p-3 border-b">Total Bayar</th>
              <th className="p-3 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.rows.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{payment.Nama}</td>
                <td className="p-3 border-b">{payment.Sekolah}</td>
                <td className="p-3 border-b">{payment.jumlah_siswa}</td>
                <td className="p-3 border-b">Rp {payment.total_bayar.toLocaleString('id-ID')}</td>
                <td className="p-3 border-b">
                  <form action="/api/payment/approve" method="POST">
                    <input type="hidden" name="payment_id" value={payment.id} />
                    <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">Setujui</button>
                  </form>
                </td>
              </tr>
            ))}
            {pendingPayments.rows.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">Tidak ada pembayaran pending.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
