'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/dashboard/${data.role}`);
        router.refresh();
      } else {
        setError(data.error || 'Terjadi kesalahan sistem.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-emerald-50 relative overflow-hidden">
      {/* Garis atas dekoratif Emas */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706]"></div>
      
      <div className="text-center mb-8 mt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl mb-4 border border-emerald-100 shadow-inner">
          <svg style={{ width: '28px', height: '28px' }} className="text-[#064e3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-[#064e3b]">Portal Guru</h2>
        <p className="text-sm text-emerald-600 mt-2 font-medium">Silakan login untuk mendaftarkan siswa.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-red-200 flex items-center gap-3">
          <svg style={{ width: '20px', height: '20px' }} className="flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-extrabold text-[#064e3b] mb-2 tracking-wide">Username (NIP/ID)</label>
          <input 
            type="text" 
            placeholder="Masukkan username Anda"
            className="w-full border-2 border-emerald-100 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] transition-all text-gray-900 bg-emerald-50/30 focus:bg-white font-medium" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-extrabold text-[#064e3b] mb-2 tracking-wide">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full border-2 border-emerald-100 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-[#059669] transition-all text-gray-900 bg-emerald-50/30 focus:bg-white font-medium" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-[#064e3b] font-extrabold py-4 rounded-xl transition-all shadow-lg mt-4 flex justify-center items-center gap-2 text-lg border-b-4 
            ${loading ? 'bg-amber-300 border-amber-400 cursor-not-allowed' : 'bg-[#fbbf24] border-[#d97706] hover:bg-[#f59e0b] hover:border-[#b45309] hover:-translate-y-1 active:translate-y-0 active:border-b-0'}`}
        >
          {loading ? (
             <>
               <svg style={{ width: '20px', height: '20px' }} className="animate-spin text-[#064e3b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Memproses...
             </>
          ) : 'Masuk ke Sistem'}
        </button>
        <div className="mt-6 text-center text-sm font-medium text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-[#064e3b] font-extrabold hover:text-[#d97706] hover:underline transition-colors">
            Daftar Khusus Guru
          </a>
        </div>
      </form>
    </div>
  );
}
