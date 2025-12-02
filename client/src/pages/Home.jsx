// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import SearchOptions from '../components/SearchOptions';
import Pagination from '../components/common/Pagination';
import SearchByCoverModal from '../components/modals/SearchByCover';
import SearchByContentModal from '../components/modals/SearchByContent';

import { fetchAllBooks, searchBooksByTitle } from '../api/bookApi';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState({ type: 'all', value: '' });
  const navigate = useNavigate();

  const loadBooks = async (page = 1, query = activeQuery) => {
    setLoading(true);
    let results = [];
    let total = 1;

    try {
      if (query.type === "title") {
        results = await searchBooksByTitle(query.value);
        total = 1; 
      } else {
        const data = await fetchAllBooks(page);
        results = data.books ?? [];
        total = data.total ?? 1;
      }
    } catch (err) {
      console.error("Error loading books:", err);
    }

    setBooks(results);
    setTotalPages(total);
    setCurrentPage(page);
    setLoading(false);
  };

  const handleTitleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      loadBooks(1, { type: 'all', value: '' });
      setActiveQuery({ type: 'all', value: '' });
    } else {
      loadBooks(1, { type: 'title', value: query });
      setActiveQuery({ type: 'title', value: query });
    }
  };

  // ✅ Handler baru untuk redirect ke halaman pencarian cover
  const handleCoverSearch = (results) => {
    if (!results || results.length === 0) {
      alert("Tidak ada buku yang cocok ditemukan");
      return;
    }
    
    // Navigate ke halaman SearchByCoverPage dengan state results
    navigate('/search/cover', { state: { results } });
  };

  // ✅ Handler baru untuk redirect ke halaman pencarian content
  const handleContentSearch = (results) => {
    if (!results || results.length === 0) {
      alert("Tidak ada buku yang cocok ditemukan");
      return;
    }
    
    // Navigate ke halaman SearchByContentPage dengan state results
    navigate('/search/content', { state: { results } });
  };

  useEffect(() => {
    loadBooks(1, { type: 'all', value: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchSubmit={handleTitleSearch}
        />

        <SearchOptions
          onCoverClick={() => setIsCoverModalOpen(true)}
          onContentClick={() => setIsContentModalOpen(true)}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {activeQuery.type === 'title'
              ? `Hasil Pencarian: "${activeQuery.value}"`
              : 'Book Collections'}
          </h2>

          {loading ? (
            <p className="text-center text-indigo-600 dark:text-indigo-400">Loading buku...</p>
          ) : books.length > 0 ? (
            <BookList books={books} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada buku ditemukan.</p>
          )}
        </div>

        {activeQuery.type === 'all' && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => loadBooks(page, { type: 'all', value: '' })}
            />
          </div>
        )}
      </main>

      {/* ✅ Update handler untuk modal */}
      <SearchByCoverModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onSearchComplete={(results) => {
          handleCoverSearch(results);
          setIsCoverModalOpen(false);
        }}
      />

      <SearchByContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        onSearchComplete={(results) => {
          handleContentSearch(results);
          setIsContentModalOpen(false);
        }}
      />


      <Footer />
    </div>
  );
};

export default Home;