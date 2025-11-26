// src/frontend/components/BookCard.jsx
import React from 'react';

// Asumsi: book object memiliki { id, title, author, cover (URL) }
const BookCard = ({ book }) => {
  return (
    // Card Container: menggunakan shadow dan hover effect
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]">
      
      {/* Book Cover Image */}
      <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-700">
        <img 
          src={book.cover} 
          alt={`Cover of ${book.title}`}
          // Menyesuaikan gambar agar menutupi area dan berada di tengah
          className="w-full h-full object-cover" 
          // Fallback jika URL gambar dari API simulasi gagal dimuat
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x300?text=No+Cover" }} 
        />
      </div>

      {/* Book Details */}
      <div className="p-4 text-center">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
          {book.author || "Penulis Tidak Diketahui"}
        </p>
      </div>
    </div>
  );
};

export default BookCard;