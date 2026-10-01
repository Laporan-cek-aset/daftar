'use client';
import { useState } from 'react';

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const endpoint = isLogin ? '/api/auth' : '/api/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (res.ok) {
        if (isLogin) {
          window.location.href = '/'; // Muat ulang untuk masuk ke Dashboard
        } else {
          setSuccess('Pendaftaran berhasil! Silakan login.');
          setIsLogin(true);
          e.target.reset();
        }
      } else {
        setError(result.error || 'Terjadi kesalahan sistem.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-emerald-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706]"></div>
      
      <div className="text-center mb-8 mt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl mb-4 border border-emerald-100 shadow-inner">
          <svg style={{ width: '28px', height: '28px' }} className="text-[#064e3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-[#064e3b]">{isLogin ? 'Portal Guru' : 'Daftar Akun Guru'}</h2>
        <p className="text-sm text-emerald-600 mt-2 font-medium">{isLogin ? 'Silakan login untuk mendaftarkan siswa.' : 'Buat akun untuk mendaftarkan siswa Anda.'}</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-red-200">⚠️ {error}</div>}
      {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-green-200">✅ {success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Nama Lengkap</label>
              <input type="text" name="nama" required className="w-full border-2 border-emerald-100 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] bg-emerald-50/30" placeholder="Cth: Suwanto, S.Pd" disabled={loading}/>
            </div>
            <div>
              <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Asal Sekolah</label>
              <input type="text" name="sekolah" required className="w-full border-2 border-emerald-100 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] bg-emerald-50/30" placeholder="Cth: MI Baiturrahman" disabled={loading}/>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Username (NIP/ID)</label>
          <input type="text" name="username" required className="w-full border-2 border-emerald-100 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] bg-emerald-50/30" placeholder={isLogin ? "Masukkan username" : "Buat username"} disabled={loading}/>
        </div>
        <div>
          <label className="block text-sm font-extrabold text-[#064e3b] mb-1">Password</label>
          <input type="password" name="password" required className="w-full border-2 border-emerald-100 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] bg-emerald-50/30" placeholder="••••••••" disabled={loading}/>
        </div>
        
        <button type="submit" disabled={loading} className={`w-full text-[#064e3b] font-extrabold py-3.5 rounded-xl transition-all shadow-md mt-4 border-b-4 ${loading ? 'bg-amber-300 border-amber-400' : 'bg-[#fbbf24] border-[#d97706] hover:bg-[#f59e0b] active:translate-y-1 active:border-b-0'}`}>
          {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Sistem' : 'Daftar Sekarang')}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm font-medium text-gray-600">
        {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} className="text-[#064e3b] font-extrabold hover:text-[#d97706] transition-colors underline">
          {isLogin ? 'Daftar Khusus Guru' : 'Login di sini'}
        </button>
      </div>
    </div>
  );
}
