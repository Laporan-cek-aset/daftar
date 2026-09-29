'use client';
import { useState } from 'react';

export default function UploadExcelComponent() {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Mohon pilih file Excel terlebih dahulu.');
      return;
    }
    
    // Alert sementara untuk memastikan UI berfungsi
    alert(`File ${file.name} siap diunggah. Integrasi API upload akan dijalankan.`);
  };

  return (
    <form onSubmit={handleUpload} className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File Excel Data Siswa</label>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 mb-4"
        required
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Unggah Data
      </button>
    </form>
  );
}
