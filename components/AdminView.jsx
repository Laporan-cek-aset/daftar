'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminView({ session, pendingPayments, schools, announcements }) {
  const [activeTab, setActiveTab] = useState('verifikasi');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fungsi pengiriman form tanpa memuat ulang halaman
  const handleApprove = async (id) => {
    setIsProcessing(true);
    const fd = new FormData(); fd.append('payment_id', id);
    await fetch('/api/payment/approve', { method: 'POST', body: fd });
    router.refresh(); // Menarik data terbaru dari database seketika
    setIsProcessing(false);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const fd = new FormData(e.target);
    await fetch('/api/announcement/create', { method: 'POST', body: fd });
    e.target.reset();
    router.refresh();
    setIsProcessing(false);
  };

  const handleDeleteAnnouncement = async (id) => {
    setIsProcessing(true);
    const fd = new FormData(); fd.append('id', id);
    await fetch('/api/announcement/delete', { method: 'POST', body: fd });
    router.refresh();
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col md:flex-row font-sans">
      {/* SIDEBAR ADMIN */}
      <aside className="w-full md:w-64 bg-[#064e3b] text-white flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 border-b border-emerald-700/50">
          <div className="w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-xl flex items-center justify-center border border-white mb-4">
             <span className="text-sm font-extrabold text-[#064e3b]">TKA</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#fcd34d]">Portal Admin</h2>
          <p className="text-sm text-emerald-200 mt-1 font-medium truncate">{session.username}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('verifikasi')} className={`w-full text-left block px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'verifikasi' ? 'bg-[#047857] text-[#fcd34d] shadow-sm border-l-4 border-[#fbbf24]' : 'hover:bg-emerald-800 text-emerald-100'}`}>
            🏠 Verifikasi Tagihan
          </button>
          <button onClick={() => setActiveTab('pengumuman')} className={`w-full text-left block px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'pengumuman' ? 'bg-[#047857] text-[#fcd34d] shadow-sm border-l-4 border-[#fbbf24]' : 'hover:bg-emerald-800 text-emerald-100'}`}>
            📢 Kelola Pengumuman
          </button>
          <button onClick={() => setActiveTab('sekolah')} className={`w-full text-left block px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'sekolah' ? 'bg-[#047857] text-[#fcd34d] shadow-sm border-l-4 border-[#fbbf24]' : 'hover:bg-emerald-800 text-emerald-100'}`}>
            🏫 Daftar Sekolah
          </button>
        </nav>

        <div className="p-4 border-t border-emerald-700/50">
          <form action="/api/logout" method="POST">
            <button type="submit" className="w-full text-left px-4 py-3 text-red-300 hover:bg-emerald-800 hover:text-red-200 rounded-xl font-bold transition-all">Keluar Sistem</button>
          </form>
        </div>
      </aside>

      {/* KONTEN ADMIN */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto w-full relative">
        {isProcessing && <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold shadow-md animate-pulse">Memproses Data...</div>}
        
        {/* TAB 1: VERIFIKASI */}
        {activeTab === 'verifikasi' && (
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] mb-6 sm:mb-8">Verifikasi Pembayaran</h1>
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-50 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-emerald-50/50">
                    <th className="p-3 border-b font-extrabold text-[#064e3b]">Guru</th>
                    <th className="p-3 border-b font-extrabold text-[#064e3b]">Sekolah</th>
                    <th className="p-3 border-b font-extrabold text-[#064e3b]">Siswa</th>
                    <th className="p-3 border-b font-extrabold text-[#064e3b]">Bayar</th>
                    <th className="p-3 border-b font-extrabold text-[#064e3b]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b font-bold">{p.Nama}</td>
                      <td className="p-3 border-b text-gray-600">{p.Sekolah}</td>
                      <td className="p-3 border-b font-bold text-emerald-600">{p.jumlah_siswa}</td>
                      <td className="p-3 border-b font-bold text-amber-600">Rp {p.total_bayar.toLocaleString('id-ID')}</td>
                      <td className="p-3 border-b">
                        <button onClick={() => handleApprove(p.id)} disabled={isProcessing} className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-md">Setujui</button>
                      </td>
                    </tr>
                  ))}
                  {pendingPayments.length === 0 && (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium italic">Tidak ada tagihan yang pending.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PENGUMUMAN */}
        {activeTab === 'pengumuman' && (
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] mb-6">Kelola Papan Pengumuman</h1>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50 mb-8">
              <h2 className="text-xl font-bold text-[#064e3b] mb-4">Buat Pengumuman Baru</h2>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <input type="text" name="title" required className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Judul Pengumuman" disabled={isProcessing}/>
                <textarea name="content" required rows="4" className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Isi Pesan..." disabled={isProcessing}></textarea>
                <input type="url" name="image_url" className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Link Google Drive / Lampiran Gambar (Opsional)" disabled={isProcessing}/>
                <button type="submit" disabled={isProcessing} className="w-full bg-[#fbbf24] text-[#064e3b] font-extrabold py-3.5 rounded-xl hover:bg-[#f59e0b] shadow-md border-b-4 border-[#d97706] active:translate-y-1 active:border-b-0">Terbitkan Pengumuman</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50">
              <h2 className="text-xl font-bold text-[#064e3b] mb-4">Riwayat Pengumuman</h2>
              <div className="space-y-3">
                {announcements.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">{item.title}</h3>
                      <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                    <button onClick={() => handleDeleteAnnouncement(item.id)} disabled={isProcessing} className="text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1.5 rounded-xl text-sm">Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEKOLAH */}
        {activeTab === 'sekolah' && (
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] mb-6">Daftar Sekolah Peserta</h1>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-emerald-50/50">
                    <th className="p-3 border-b border-emerald-100 font-extrabold text-[#064e3b]">No</th>
                    <th className="p-3 border-b border-emerald-100 font-extrabold text-[#064e3b]">Asal Sekolah</th>
                    <th className="p-3 border-b border-emerald-100 font-extrabold text-[#064e3b]">Siswa Terdaftar</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-100 font-bold">{index + 1}</td>
                      <td className="p-3 border-b border-gray-100 font-bold text-[#064e3b]">{school.Sekolah}</td>
                      <td className="p-3 border-b border-gray-100"><span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full font-bold text-sm">{school.jumlah_siswa} Siswa</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
