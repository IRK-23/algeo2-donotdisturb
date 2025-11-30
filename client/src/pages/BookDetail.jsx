// src/pages/BookDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { simulatedBooks } from '../api/bookApi';
import BookCard from '../components/BookCard';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const dummyContent = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.
`;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const found = simulatedBooks.find(b => b.id === Number(id));
    setBook(found);
  }, [id]);

  if (!book) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* FIXED BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-30 bg-white dark:bg-indigo-600 dark:hover:bg-indigo-800 text-gray-800 dark:text-white hover:bg-gray-400 hover:shadow-xl transition transform font-semibold px-4 py-2 rounded-lg shadow"
      >
        ← Home
      </button>

      {/* MAIN */}
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10">

          {/* COVER */}
          <img
            src={book.cover}
            alt={book.title}
            className="rounded-xl shadow-xl w-72"
          />

          {/* DETAILS */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {book.title}
            </h1>

            <p className="mt-4 text-gray-700 dark:text-gray-200 leading-relaxed">
              {showFullContent
                ? dummyContent
                : dummyContent.substring(0, 1200) + "..."}
            </p>

            {!showFullContent && (
              <button
                onClick={() => setShowFullContent(true)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold rounded-lg px-5 py-2"
              >
                READ MORE
              </button>
            )}
          </div>
        </div>

        {/* RECOMMENDATION */}
        <h2 className="mt-16 text-lg font-bold text-center text-gray-800 dark:text-gray-100">
          Similar books because you read: <br /> {book.title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto mt-8">
          {simulatedBooks
            .filter(b => b.id !== book.id)
            .slice(0, 5)
            .map(b => (
              <BookCard key={b.id} book={b} />
            ))}
        </div>
      </main>

      <Footer />

      {/* MODAL */}
      {showFullContent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
          {/* Tambahkan 'relative' di sini */}
          <div className="bg-white dark:bg-gray-800 p-6 max-w-3xl rounded-lg shadow-xl max-h-[70vh] overflow-y-auto relative"> 
            
            {/* Pindahkan tombol Close ke atas konten lain di modal */}
            <button
              onClick={() => setShowFullContent(false)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-2xl font-bold transition-colors duration-200 p-1"
              aria-label="Tutup Detail Konten Penuh" // Tambahkan untuk aksesibilitas
            >
              ✕
            </button>

            {/* H3 dan P yang ada */}
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 pr-10">
              {book.title} - Full Content
            </h3>

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {dummyContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
