import React, { useState, useEffect } from 'react';
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

  const loadBooks = async (page = 1) => {
    setLoading(true);
    let results = [];
    let total = 1;

    try {
      const data = await fetchAllBooks(page);
      results = data.books;
      total = data.totalPages;

      setBooks(results);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleSearch = (e) => {
    e.preventDefault(); 
    const query = searchTerm.trim(); 

    if (!query) {
      loadBooks(1);
    } else {
      searchBooksByTitle(query).then((results) => {
        setBooks(results);
        setTotalPages(1);
        setCurrentPage(1);
      });
    }
  };

  useEffect(() => {
    loadBooks(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchSubmit={handleTitleSearch}
        />
        <SearchOptions />
        <div className="mt-8">
          {loading ? (
            <p className="text-center text-indigo-600 dark:text-indigo-400">Loading books...</p>
          ) : books.length > 0 ? (
            <BookList books={books} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No books found.</p>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => loadBooks(page)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
