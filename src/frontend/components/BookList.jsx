// src/frontend/components/BookList.jsx
import React from 'react';
import BookCard from './BookCard'; 

// Props yang diterima: books (array buku)
const BookList = ({ books }) => {
  if (!books || books.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada buku ditemukan.</p>;
  }

  return (
    // Layout 1 Kolom di HP, 3 di tablet kecil, dan 5 kolom di desktop (md ke atas)
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">      
        {books.map((book) => (
        // Render BookCard untuk setiap item di array buku
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;