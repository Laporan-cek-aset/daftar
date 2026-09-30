'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nama: '', sekolah: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Pendaftaran berhasil! Silakan login.');
        router.push('/');
      } else {
        setError(data.error || 'Gagal mendaftar');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706]"></div>
        
        <h2 className="text-3xl font-extrabold text-[#064e3b] text-center mb-2 mt-2">Daftar Akun Guru</h2>
        <p className="text-sm text-emerald-600 mt-2 font-medium text-center mb-8">Buat akun untuk mendaftarkan siswa Anda.</p>
        
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-red-200">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Nama Lengkap</label>
            <input type="text" required className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] outline-none font-medium bg-emerald-50/30 focus:bg-white" 
              onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Cth: Suwanto, S.Pd" />
          </div>
          <div>
            <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Asal Sekolah</label>
            <input type="text" required className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] outline-none font-medium bg-emerald-50/30 focus:bg-white" 
              onChange={e => setFormData({...formData, sekolah: e.target.value})} placeholder="Cth: MI Baiturrahman" />
          </div>
          <div>
            <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Username (NIP/ID)</label>
            <input type="text" required className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] outline-none font-medium bg-emerald-50/30 focus:bg-white" 
              onChange={e => setFormData({...formData, username: e.target.value})} placeholder="Buat username" />
          </div>
          <div>
            <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Password</label>
            <input type="password" required className="w-full border-2 border-emerald-100 px-4 py-3 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] outline-none font-medium bg-emerald-50/30 focus:bg-white" 
              onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Buat password" />
          </div>
          <button type="submit" disabled={loading} className="w-full text-[#064e3b] font-extrabold py-4 rounded-xl bg-[#fbbf24] border-b-4 border-[#d97706] hover:bg-[#f59e0b] hover:border-[#b45309] hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-all shadow-lg mt-6">
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm font-medium">
          Sudah punya akun? <a href="/" className="text-[#064e3b] font-extrabold hover:text-[#d97706] hover:underline transition-colors">Login di sini</a>
        </div>
      </div>
    </div>
  );
}
