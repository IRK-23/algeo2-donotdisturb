// src/frontend/components/SearchOptions.jsx
import React from 'react';

const SearchOptions = ({ onCoverClick, onContentClick }) => {
  return (
    <div className="mt-6 mb-12 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
      
      {/* Tombol 1: Search By Book Cover */}
      <button
        onClick={onCoverClick}
        className="flex flex-col items-center justify-center py-2 px-8 w-64 h-12
                   bg-indigo-600 text-white rounded-full shadow-lg 
                   hover:bg-indigo-700 hover:shadow-xl transition transform hover:scale-105"
      >
        <span className="text-sm font-semibold">Search By Book Cover</span>
        <span className="text-sm opacity-80">(Upload Gambar)</span>
      </button>

      {/* Tombol 2: Search By Book Content */}
      <button
        onClick={onContentClick}
        className="flex flex-col items-center justify-center py-2 px-8 w-64 h-12
                   bg-indigo-600 text-white rounded-full shadow-lg 
                   hover:bg-indigo-700 hover:shadow-xl transition transform hover:scale-105"
      >
        <span className="text-sm font-semibold">Search By Book Content</span>
        <span className="text-sm opacity-80">(Upload Teks)</span>
      </button>
    </div>
  );
};

export default SearchOptions;