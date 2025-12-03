// src/pages/SearchByContentPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBookFullText } from '../api/bookApi';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BookCard from '../components/BookCard';

const SearchByContentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [topMatch, setTopMatch] = useState(null);
  const [fullContent, setFullContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  // Load full text content
  const loadContent = useCallback(async (bookId) => {
    setLoadingContent(true);
    try {
      const text = await getBookFullText(bookId);
      setFullContent(text);
    } catch (error) {
      console.error("Error loading content:", error);
      setFullContent("(Gagal memuat konten)");
    } finally {
      setLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    console.log("[CONTENT PAGE] Component mounted");
    console.log("[CONTENT PAGE] location.state:", location.state);
    
    const searchResults = location.state?.results;

    if (!searchResults || searchResults.length === 0) {
      console.warn("[CONTENT PAGE] No results found, redirecting to home");
      navigate('/');
      return;
    }

    console.log("[CONTENT PAGE] Got", searchResults.length, "results");

    // Buku pertama adalah top match
    const bestMatch = searchResults[0];
    console.log("[CONTENT PAGE] Best match:", bestMatch);
    
    setTopMatch(bestMatch);
    
    // Sisanya adalah rekomendasi
    setResults(searchResults.slice(1));

    // Load content untuk top match
    loadContent(bestMatch.id);

    window.scrollTo(0, 0);
  }, [location, navigate, loadContent]);

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
            Search Results by Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ditemukan {results.length + 1} buku dengan konten serupa
          </p>
        </div>

        {/* TOP MATCH - QUERY CONTENT */}
        <div className="mb-12">
          <div className="text-center mb-4">
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              📄 Best Match
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-5xl mx-auto">
            
            {/* BOOK TITLE */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
              {topMatch.title}
            </h2>

            {/* SIMILARITY SCORE */}
            {topMatch.similarity !== undefined && (
              <div className="mb-6 max-w-md mx-auto">
                <span className="text-sm text-gray-600 dark:text-gray-400 block text-center mb-2">
                  Content Similarity: {(topMatch.similarity * 100).toFixed(1)}%
                </span>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${topMatch.similarity * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* CONTENT FRAME */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Book Content Preview:
              </h3>
              
              <div className="p-6 border border-gray-300 dark:border-gray-700 
                              bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner 
                              max-h-[400px] overflow-y-auto">
                {loadingContent ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="ml-3 text-indigo-500">Memuat konten...</p>
                  </div>
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed 
                                whitespace-pre-line text-justify text-sm">
                    {fullContent}
                  </p>
                )}
              </div>
            </div>

            {/* VIEW DETAIL BUTTON */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate(`/book/${topMatch.id}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white 
                           px-8 py-3 rounded-lg font-semibold transition 
                           transform hover:scale-105 shadow-lg"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>

        {/* SIMILAR CONTENT - RECOMMENDATIONS */}
        {results.length > 0 && (
          <>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                Similar Content Books
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Buku lain dengan konten yang mirip
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                            gap-6 max-w-6xl mx-auto">
              {results.map((book) => (
                <div key={book.id} className="transform hover:scale-105 transition">
                  <BookCard book={book} />
                  {book.similarity !== undefined && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Similarity: {(book.similarity * 100).toFixed(1)}%
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

export default SearchByContentPage;