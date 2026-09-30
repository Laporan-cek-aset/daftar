'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

export default function UploadExcelComponent({ sekolahGuru, studentsData, limit }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setNotif({ type: 'error', message: 'Harap pilih file Excel terlebih dahulu.' });
      return;
    }

    setLoading(true);
    setNotif(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (rawData.length > limit) {
          setNotif({ type: 'error', message: `Siswa yang diunggah (${rawData.length}) melebihi kuota pembayaran (${limit}).` });
          setLoading(false);
          return;
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: rawData, sekolah: sekolahGuru })
        });

        const result = await res.json();
        
        if (res.ok) {
          setNotif({ type: 'success', message: 'Data siswa berhasil diunggah dan disimpan!' });
          setTimeout(() => router.refresh(), 1500); // Refresh data tabel
        } else {
          setNotif({ type: 'error', message: result.error || 'Gagal menyimpan data.' });
        }
      } catch (err) {
        setNotif({ type: 'error', message: 'Format file tidak valid. Pastikan menggunakan template yang disediakan.' });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      {/* Custom Notification Alert */}
      {notif && (
        <div className={`mb-6 p-4 rounded-xl font-bold flex items-center gap-3 border ${notif.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          <span className="text-2xl">{notif.type === 'success' ? '✅' : '⚠️'}</span>
          {notif.message}
        </div>
      )}

      <form onSubmit={handleUpload} className="mb-8 p-6 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-[#064e3b] mb-2">Unggah File Data Siswa (.xlsx)</label>
          <input 
            type="file" accept=".xlsx, .xls" 
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#047857] cursor-pointer"
            required
          />
        </div>
        <button type="submit" disabled={loading} className={`px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all whitespace-nowrap mt-6 sm:mt-0 ${loading ? 'bg-gray-400' : 'bg-[#d97706] hover:bg-[#b45309]'}`}>
          {loading ? 'Mengunggah...' : '🚀 Unggah & Simpan'}
        </button>
      </form>

      {/* Tabel Render Siswa */}
      <h3 className="font-extrabold text-xl text-[#064e3b] mb-4 border-b pb-2">Daftar Siswa Terdaftar ({studentsData.length}/{limit})</h3>
      <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 border-b font-bold text-gray-700">No</th>
              <th className="p-4 border-b font-bold text-gray-700">Nama Siswa</th>
              <th className="p-4 border-b font-bold text-gray-700">Username</th>
              <th className="p-4 border-b font-bold text-gray-700">Password</th>
              <th className="p-4 border-b font-bold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.length > 0 ? studentsData.map((s, idx) => (
              <tr key={s.ID || idx} className="hover:bg-emerald-50/50">
                <td className="p-4 border-b text-gray-600 font-medium">{idx + 1}</td>
                <td className="p-4 border-b font-bold text-[#064e3b]">{s.Nama || '-'}</td>
                <td className="p-4 border-b text-gray-600 font-mono">{s.Username || s.username || '-'}</td>
                <td className="p-4 border-b text-gray-600 font-mono">{s.Password || s.password || '-'}</td>
                <td className="p-4 border-b">
                  <button onClick={() => alert(`Fitur edit untuk ${s.Nama} sedang dikembangkan.`)} className="text-blue-500 hover:text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium italic">Data siswa belum diunggah.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
