// src/frontend/components/common/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    // Footer: Selalu di bagian bawah dan menggunakan warna gelap untuk kontras
    <footer className="bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Kredit Nama Anggota Kelompok */}
        <p className="text-gray-900 dark:text-white font-semibold mb-2">
          Created by:
        </p>
        <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
          <li>Keisha Rizka Syofyani     13524073</li>
          <li>Agatha Titianingseto      13524008</li>
          <li>Reynard Anderson Wijaya   13524111</li>
        </ul>
        
        {/* Informasi Mata Kuliah dan Institusi */}
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
          <p className="text-md text-gray-800 dark:text-gray-300 font-medium">
            Tugas Besar IF2123 Aljabar Linier dan Geometri
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-500">
            <li>Laboratorium Ilmu dan Rekayasa Komputasi</li>
            <li>Program Studi Teknik Informatika</li>
            <li>Sekolah Teknik Elektro dan Informatika</li>
            <li>Institut Teknologi Bandung</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;