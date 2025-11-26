import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchTerm, onSearchTermChange, onSearchSubmit }) => {
  return (
    <form onSubmit={onSearchSubmit} className="flex justify-center mb-10 mt-4">
      
      <div className="flex w-full max-w-xl shadow-md rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        
        {/* Input */}
        <input
          type="text"
          placeholder="Cari Judul Buku..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-6 pr-3 py-3 w-full bg-transparent focus:outline-none text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        />

        {/* Tombol ikon */}
        <button
          type="submit"
          className="bg-indigo-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 
                     text-white px-4 flex items-center justify-center rounded-r-full transition"
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
        </button>

      </div>
    </form>
  );
};

export default SearchBar;
