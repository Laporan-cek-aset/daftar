'use client';
import { useState } from 'react';

export default function AnnouncementList({ announcements }) {
  const [selected, setSelected] = useState(null);

  if (!announcements || announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center opacity-70">
        <svg style={{ width: '64px', height: '64px' }} className="text-emerald-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <p className="text-emerald-800 font-semibold text-lg">Belum ada pengumuman saat ini.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {announcements.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelected(item)}
            className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md hover:bg-emerald-50 transition duration-200 cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="font-extrabold text-xl text-[#064e3b] mb-1">{item.title}</h3>
              <span className="text-xs font-bold text-[#d97706] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
              </span>
            </div>
            <div className="text-emerald-500 font-bold text-sm bg-emerald-100 px-4 py-2 rounded-xl">
              Lihat Detail 👁️
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="bg-[#064e3b] p-5 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold truncate pr-4">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full font-bold flex items-center justify-center transition">X</button>
            </div>
            <div className="p-6 overflow-y-auto">
              {selected.image_url && (
                <img src={selected.image_url} alt="Lampiran" className="mb-6 rounded-xl w-full max-h-80 object-cover border border-gray-200 shadow-sm" />
              )}
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{selected.content}</p>
              
              {/* Jika Link Unduhan Diisi (Biasanya ditempatkan di image_url untuk file lain) */}
              {selected.image_url && selected.image_url.includes('drive.google') && (
                <div className="mt-8">
                  <a href={selected.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition">
                    📥 Unduh Lampiran File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
