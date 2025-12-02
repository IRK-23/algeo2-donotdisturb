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
      <div className="relative w-full style={{ aspectRatio: '2 / 3' } bg-gray-200 dark:bg-gray-700">
        <img
          src={`http://localhost:5000${book.cover}`}
          alt={book.title}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/200x300?text=No+Cover";
          }}
        />
      </div>


      {/* DETAILS */}
      <div className="p-4">
        <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {book.title}
        </h3>

        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
          Book ID : {book.id || 'Book ID not found'}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
