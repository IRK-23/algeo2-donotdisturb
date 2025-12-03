// src/frontend/components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Fungsi untuk menghasilkan angka halaman yang terlihat (misalnya: 1, 2, 3, ..., 6)
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Batasan jumlah nomor halaman yang ditampilkan
    
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      // Tampilkan semua jika total halaman sedikit
      startPage = 1;
      endPage = totalPages;
    } else {
      // Logika untuk menampilkan halaman di sekitar halaman saat ini
      startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // Sesuaikan startPage jika mencapai batas akhir
      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    // Tambahkan tombol untuk halaman yang terlihat
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-4 py-2 rounded-lg font-semibold transition 
            ${i === currentPage 
              ? 'bg-indigo-600 text-white shadow-md' // Halaman Aktif
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600' // Halaman Non-Aktif
            }`}
        >
          {i}
        </button>
      );
    }
    
    // Tambahkan ellipsis jika diperlukan (logika yang disederhanakan)
    if (startPage > 1) {
        pages.unshift(<span key="start-dots" className="mx-1 px-2 py-2 text-gray-500">...</span>);
    }
    if (endPage < totalPages) {
        pages.push(<span key="end-dots" className="mx-1 px-2 py-2 text-gray-500">...</span>);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-10">
      
      {/* Tombol Sebelumnya */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      >
        &lt;
      </button>

      {/* Nomor Halaman */}
      {renderPageNumbers()}

      {/* Tombol Selanjutnya */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      >
        &gt;
      </button>
      
    </div>
  );
};

export default Pagination;