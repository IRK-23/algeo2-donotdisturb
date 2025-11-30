// src/frontend/components/BookList.jsx
import React from "react";
import BookCard from "./BookCard";

const BookList = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Tidak ada buku ditemukan.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
