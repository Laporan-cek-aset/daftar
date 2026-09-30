export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export default async function DaftarSekolah() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return <div>Akses Ditolak</div>;

  const schools = await db.execute(`
    SELECT Sekolah, COUNT(ID) as jumlah_siswa 
    FROM Users 
    WHERE Role = 'siswa' AND Sekolah != '' AND Sekolah IS NOT NULL
    GROUP BY Sekolah
    ORDER BY jumlah_siswa DESC
  `);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#064e3b]">Daftar Sekolah Peserta</h1>
        <p className="text-emerald-600 font-medium mt-2">Rekapitulasi jumlah siswa yang telah didaftarkan per sekolah.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50/50">
              <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">No</th>
              <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Asal Sekolah</th>
              <th className="p-4 border-b border-emerald-100 font-extrabold text-[#064e3b]">Jumlah Siswa Terdaftar</th>
            </tr>
          </thead>
          <tbody>
            {schools.rows.map((school, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b border-gray-100 font-bold text-gray-800">{index + 1}</td>
                <td className="p-4 border-b border-gray-100 font-bold text-[#064e3b]">{school.Sekolah}</td>
                <td className="p-4 border-b border-gray-100">
                  <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full font-bold">{school.jumlah_siswa} Siswa</span>
                </td>
              </tr>
            ))}
            {schools.rows.length === 0 && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500 font-bold">Belum ada sekolah yang mendaftarkan siswa.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
