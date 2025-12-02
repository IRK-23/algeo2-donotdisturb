// src/pages/SearchByCoverPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BookCard from '../components/BookCard';

const SearchByCoverPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [topMatch, setTopMatch] = useState(null);

  useEffect(() => {
    // Ambil results dari state yang dikirim oleh Home.jsx
    const searchResults = location.state?.results;

    if (!searchResults || searchResults.length === 0) {
      // Jika tidak ada hasil, redirect ke home
      navigate('/');
      return;
    }

    // Buku pertama adalah top match (query cover)
    setTopMatch(searchResults[0]);
    
    // Sisanya adalah rekomendasi
    setResults(searchResults.slice(1));

    window.scrollTo(0, 0);
  }, [location, navigate]);

  if (!topMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl font-medium dark:text-gray-300">Memuat hasil pencarian...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      <Header />

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-30 bg-white dark:bg-indigo-600 dark:hover:bg-indigo-800 
                   text-gray-800 dark:text-white hover:bg-gray-400 hover:shadow-xl 
                   transition transform font-semibold px-4 py-2 rounded-lg shadow"
      >
        ← Home
      </button>

      {/* MAIN CONTENT */}
      <main className="p-6 max-w-6xl mx-auto pt-20">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search Results by Cover
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ditemukan {results.length + 1} buku dengan cover serupa
          </p>
        </div>

        {/* TOP MATCH - QUERY COVER */}
        <div className="flex flex-col items-center mb-12">
          <div className="mb-4">
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              📷 Best Match
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-800 
                          p-8 rounded-xl shadow-xl max-w-4xl">
            
            {/* COVER IMAGE */}
            <img
              src={`http://localhost:5000${topMatch.cover}`}
              alt={topMatch.title}
              className="rounded-xl shadow-2xl w-64 h-auto flex-shrink-0 
                         border-4 border-indigo-500"
            />

            {/* BOOK INFO */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {topMatch.title}
              </h2>
              
              {topMatch.distance !== undefined && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Similarity Score:
                  </span>
                  <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(0, 100 - (topMatch.distance * 10))}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/book/${topMatch.id}`)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white 
                           px-6 py-3 rounded-lg font-semibold transition 
                           transform hover:scale-105 shadow-lg"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* SIMILAR COVERS - RECOMMENDATIONS */}
        {results.length > 0 && (
          <>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                Similar Book Covers
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Buku lain dengan cover yang mirip
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                            gap-6 max-w-6xl mx-auto">
              {results.map((book) => (
                <div key={book.id} className="transform hover:scale-105 transition">
                  <BookCard book={book} />
                  {book.distance !== undefined && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Score: {(100 - book.distance * 10).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchByCoverPage;