'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
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
      setError(data.error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-pendidikan-yellow">
      <h2 className="text-2xl font-bold text-pendidikan-blue mb-6">Login Akun Guru</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input 
            type="text" 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pendidikan-blue" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input 
            type="password" 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pendidikan-blue" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-pendidikan-blue text-white font-bold py-2 rounded hover:bg-blue-800 transition">
          Masuk
        </button>
      </form>
    </div>
  );
}
