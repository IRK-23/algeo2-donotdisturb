import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Impor fungsi baru getBookFullText
import { getBookById, getRecommendations, getBookFullText } from '../api/bookApi'; 
import BookCard from '../components/BookCard';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';


const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  // State ini tidak lagi dibutuhkan, kita hapus
  // const [showFullContent, setShowFullContent] = useState(false); 

  // Kita gunakan state ini untuk menyimpan teks penuh yang dimuat di background
  const [fullContent, setFullContent] = useState(null); 
  const [loadingFullText, setLoadingFullText] = useState(true); // Mengganti nama state

  // Load Data utama (Detail & Rekomendasi)
  const loadData = useCallback(async (bookId) => {
    setLoading(true);
    setFullContent(null); // Reset konten penuh

    try {
      // 1. Ambil Detail Buku (ringkasan 1000 char)
      const detail = await getBookById(bookId);
      
      // 2. Ambil Rekomendasi (cepat karena di-cache)
      let recs = [];
      if (detail) {
          recs = await getRecommendations(bookId);
      }

      setBook(detail);
      setRecommend(recs);
      setLoading(false);
      
      // 3. Panggil API Teks Penuh di background setelah data utama dimuat
      if (detail && detail.hasFullText) {
          setLoadingFullText(true);
          const text = await getBookFullText(bookId);
          setFullContent(text);
          setLoadingFullText(false);
      } else {
          // Jika tidak ada teks penuh, gunakan ringkasan
          setFullContent(detail ? detail.summary : "(Teks tidak tersedia)");
          setLoadingFullText(false);
      }

    } catch (error) {
      console.error("Gagal memuat data buku:", error);
      setBook(null);
      setLoading(false);
      setLoadingFullText(false);
    }
  }, []);

  useEffect(() => {
    loadData(id);
    window.scrollTo(0, 0); 
  }, [id, loadData]); 
  
  // Handle Loading State
  if (loading) 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="p-10 text-xl font-medium dark:text-gray-300">Memuat detail buku...</p>
      </div>
    );

  // Handle Book Not Found
  if (!book) 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="p-10 text-xl font-medium text-red-600">Buku dengan ID "{id}" tidak ditemukan.</p>
      </div>
    );
  
  // Konten yang akan ditampilkan di frame scrollable
  const contentToDisplay = fullContent || book.summary || "(Teks tidak tersedia)";
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      <Header />

      {/* FIXED BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-6 z-30 bg-white dark:bg-indigo-600 dark:hover:bg-indigo-800 text-gray-800 dark:text-white hover:bg-gray-400 hover:shadow-xl transition transform font-semibold px-4 py-2 rounded-lg shadow"
      >
        ← Home
      </button>

      {/* MAIN CONTENT */}
      <main className="p-6 max-w-6xl mx-auto pt-20">
        <div className="flex flex-col md:flex-row gap-10">

          {/* COVER */}
          <img
            src={`http://localhost:5000${book.cover}`}
            alt={book.title}
            className="rounded-xl shadow-xl w-72 max-w-full flex-shrink-0 h-auto"
          />

          {/* DETAILS & CONTENT FRAME */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {book.title}
            </h1>
            
            <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3'>
                Book Content:
            </h2>

            {/* CONTENT FRAME DENGAN SCROLL */}
            <div 
                className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-inner 
                           max-h-[350px] overflow-y-auto"
            >
                {loadingFullText ? (
                    <p className="text-lg text-indigo-500">Memuat teks penuh di latar belakang...</p>
                ) : (
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line text-justify text-sm">
                        {contentToDisplay}
                    </p>
                )}
            </div>
          </div>
        </div>

        {/* RECOMMENDATION */}
        {recommend.length > 0 && (
          <>
            <h2 className="mt-16 text-xl font-bold text-center text-gray-800 dark:text-gray-100">
              Similar books because you read: <br /> 
              <span className='text-indigo-600 dark:text-indigo-400'>{book.title}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto mt-8">
              {recommend.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
      
    </div>
  );
};

export default BookDetail;