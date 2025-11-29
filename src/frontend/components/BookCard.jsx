// src/frontend/components/BookCard.jsx
import { useNavigate } from 'react-router-dom';
import React from 'react';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="
        bg-white dark:bg-gray-800 
        rounded-xl 
        shadow-md hover:shadow-xl 
        transition duration-300 
        cursor-pointer 
        overflow-hidden
        hover:-translate-y-1
      "
    >
      {/* COVER */}
      <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://via.placeholder.com/200x300?text=No+Cover';
          }}
        />
      </div>

      {/* DETAILS */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {book.title}
        </h3>

        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
          {book.author || 'Penulis Tidak Diketahui'}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
