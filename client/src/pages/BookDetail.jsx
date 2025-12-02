// // src/pages/BookDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { simulatedBooks } from '../api/bookApi';
// import BookCard from '../components/BookCard';
// import Header from '../components/common/Header';
// import Footer from '../components/common/Footer';

// const dummyContent = `
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
// nisi ut aliquip ex ea commodo consequat.
// `;

// const BookDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [book, setBook] = useState(null);
//   const [showFullContent, setShowFullContent] = useState(false);

//   useEffect(() => {
//     const found = simulatedBooks.find(b => b.id === Number(id));
//     setBook(found);
//   }, [id]);

//   if (!book) return <p className="p-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Header />

//       {/* FIXED BACK BUTTON */}
//       <button
//         onClick={() => navigate("/")}
//         className="fixed top-20 left-6 z-30 bg-white dark:bg-indigo-600 dark:hover:bg-indigo-800 text-gray-800 dark:text-white hover:bg-gray-400 hover:shadow-xl transition transform font-semibold px-4 py-2 rounded-lg shadow"
//       >
//         ← Home
//       </button>

//       {/* MAIN */}
//       <main className="p-6 max-w-6xl mx-auto">
//         <div className="flex flex-col md:flex-row gap-10">

//           {/* COVER */}
//           <img
//             src={book.cover}
//             alt={book.title}
//             className="rounded-xl shadow-xl w-72"
//           />

//           {/* DETAILS */}
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {book.title}
//             </h1>

//             <p className="mt-4 text-gray-700 dark:text-gray-200 leading-relaxed">
//               {showFullContent
//                 ? dummyContent
//                 : dummyContent.substring(0, 1200) + "..."}
//             </p>

//             {!showFullContent && (
//               <button
//                 onClick={() => setShowFullContent(true)}
//                 className="mt-4 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold rounded-lg px-5 py-2"
//               >
//                 READ MORE
//               </button>
//             )}
//           </div>
//         </div>

//         {/* RECOMMENDATION */}
//         <h2 className="mt-16 text-lg font-bold text-center text-gray-800 dark:text-gray-100">
//           Similar books because you read: <br /> {book.title}
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto mt-8">
//           {simulatedBooks
//             .filter(b => b.id !== book.id)
//             .slice(0, 5)
//             .map(b => (
//               <BookCard key={b.id} book={b} />
//             ))}
//         </div>
//       </main>

//       <Footer />

//       {/* MODAL */}
//       {showFullContent && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
//           {/* Tambahkan 'relative' di sini */}
//           <div className="bg-white dark:bg-gray-800 p-6 max-w-3xl rounded-lg shadow-xl max-h-[70vh] overflow-y-auto relative"> 
            
//             {/* Pindahkan tombol Close ke atas konten lain di modal */}
//             <button
//               onClick={() => setShowFullContent(false)}
//               className="absolute top-4 right-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-2xl font-bold transition-colors duration-200 p-1"
//               aria-label="Tutup Detail Konten Penuh" // Tambahkan untuk aksesibilitas
//             >
//               ✕
//             </button>

//             {/* H3 dan P yang ada */}
//             <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 pr-10">
//               {book.title} - Full Content
//             </h3>

//             <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
//               {dummyContent}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookDetail;


// src/pages/BookDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getBookById, getRecommendations } from "../api/bookApi";
// import BookCard from "../components/BookCard";
// import Header from "../components/common/Header";
// import Footer from "../components/common/Footer";

// const BookDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [book, setBook] = useState(null);
//   const [recommend, setRecommend] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFull, setShowFull] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);

//       const detail = await getBookById(id);
//       const recs = await getRecommendations(id);

//       setBook(detail);
//       setRecommend(recs);
//       setLoading(false);
//     };

//     load();
//   }, [id]);

//   if (loading) return <p className="p-10 text-center">Loading...</p>;

//   if (!book) return <p className="p-10 text-center text-red-600">Book not found.</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Header />

//       <button
//         onClick={() => navigate("/")}
//         className="fixed top-20 left-6 z-30 bg-white px-4 py-2 shadow rounded-lg"
//       >
//         ← Home
//       </button>

//       <main className="p-6 max-w-5xl mx-auto">
//         <div className="flex flex-col md:flex-row gap-6">
//           <img src={book.cover} className="w-64 rounded-xl shadow" />

//           <div>
//             <h1 className="text-3xl font-bold">{book.title}</h1>

//             <p className="mt-6 text-gray-800 whitespace-pre-line">
//               {showFull ? book.content : book.content.slice(0, 1200) + "..."}
//             </p>

//             {!showFull && (
//               <button
//                 className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md"
//                 onClick={() => setShowFull(true)}
//               >
//                 Read More
//               </button>
//             )}
//           </div>
//         </div>

//         <h2 className="text-xl font-semibold mt-10 text-center">
//           Recommended Books
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-4">
//           {recommend.map((b) => (
//             <BookCard key={b.id} book={b} />
//           ))}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default BookDetail;

// src/pages/BookDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getBookById, getRecommendations } from "../api/bookApi";
// import BookCard from "../components/BookCard";
// import Header from "../components/common/Header";
// import Footer from "../components/common/Footer";

// const BookDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [book, setBook] = useState(null);
//   const [recommend, setRecommend] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFull, setShowFull] = useState(false);

//   // Batas karakter untuk ringkasan konten
//   const CONTENT_LIMIT = 1200;

//   useEffect(() => {
//     // Fungsi async untuk memuat detail dan rekomendasi
//     const loadData = async () => {
//       setLoading(true);
//       setShowFull(false); // Reset status showFull setiap ID berubah

//       try {
//         const detail = await getBookById(id);
//         const recs = await getRecommendations(id);

//         setBook(detail);
//         setRecommend(recs);

//         // Jika buku tidak ditemukan, setBook akan menjadi null (ditangani di bawah)
//       } catch (error) {
//         console.error("Gagal memuat detail buku:", error);
//         setBook(null); // Pastikan state book diset ke null jika ada error API
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();

//     // Opsional: Jika Anda ingin menggulir ke atas setiap kali buku baru dimuat
//     window.scrollTo(0, 0); 
//   }, [id]);

//   // Handle Loading State
//   if (loading) 
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <p className="p-10 text-xl font-medium dark:text-gray-300">Memuat detail buku...</p>
//       </div>
//     );

//   // Handle Book Not Found
//   if (!book) 
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <p className="p-10 text-xl font-medium text-red-600">Buku dengan ID "{id}" tidak ditemukan.</p>
//       </div>
//     );
  
//   // ======================================================
//   // LOGIKA UTAMA DISPLAY
//   // ======================================================

//   const content = book.content || "(Teks konten tidak tersedia)";
//   const isContentLong = content.length > CONTENT_LIMIT;
  
//   // Tentukan konten yang akan ditampilkan (dipotong atau penuh)
//   const displayedContent = 
//     isContentLong && !showFull 
//       ? content.slice(0, CONTENT_LIMIT) + "..." 
//       : content;
      
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
//       <Header />

//       {/* Tombol Back */}
//       <button
//         onClick={() => navigate("/")}
//         className="fixed top-20 left-6 z-30 bg-white dark:bg-gray-800 dark:text-gray-100 px-4 py-2 shadow rounded-lg hover:shadow-lg transition duration-200"
//       >
//         ← Home
//       </button>

//       <main className="p-6 pt-20 max-w-5xl mx-auto">
//         <div className="flex flex-col md:flex-row gap-6 items-start">
//           {/* Cover Buku */}
//           <img 
//             src={book.cover} 
//             alt={`Cover of ${book.title}`}
//             className="w-64 max-w-full h-auto rounded-xl shadow-2xl object-cover flex-shrink-0" 
//           />

//           <div className="flex-grow">
//             {/* Judul Buku */}
//             <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
//               {book.title}
//             </h1>
            
//             {/* Konten Buku */}
//             <h2 className="text-lg font-semibold border-b pb-1 mb-3 text-gray-700 dark:text-gray-400">
//               Content:
//             </h2>
//             <p className="mt-2 text-gray-800 dark:text-gray-300 whitespace-pre-line text-justify">
//               {displayedContent}
//             </p>

//             {/* Tombol Read More/Show Less */}
//             {isContentLong && (
//               <button
//                 className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
//                 onClick={() => setShowFull(!showFull)}
//               >
//                 {showFull ? "Show Less" : "Read More"}
//               </button>
//             )}

//             {content === "(Teks konten tidak tersedia)" && (
//                 <p className="mt-4 text-sm text-red-500">File teks konten tidak dapat dimuat dari backend.</p>
//             )}
//           </div>
//         </div>
        
//         {/* Rekomendasi */}
//         {recommend.length > 0 && (
//           <>
//             <h2 className="text-2xl font-bold mt-12 mb-6 text-center text-gray-900 dark:text-white">
//               <span className="border-b-2 border-indigo-500 pb-1">📚 Recommended Books</span>
//             </h2>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-4">
//               {recommend.map((b) => (
//                 // Pastikan navigasi ke buku rekomendasi baru diatur di BookCard
//                 <BookCard key={b.id} book={b} /> 
//               ))}
//             </div>
//           </>
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default BookDetail;


// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getBookById, getRecommendations } from '../api/bookApi'; 
// import BookCard from '../components/BookCard';
// import Header from '../components/common/Header';
// import Footer from '../components/common/Footer';

// // Batas karakter untuk ringkasan di halaman detail
// const CONTENT_LIMIT = 1200; 

// const BookDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [book, setBook] = useState(null);
//   const [recommend, setRecommend] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFullContent, setShowFullContent] = useState(false);

//   // Menggunakan useCallback untuk memastikan fungsi tidak dibuat ulang pada setiap render
//   const loadData = useCallback(async (bookId) => {
//     setLoading(true);
//     setShowFullContent(false);

//     try {
//       // 1. Ambil Detail Buku
//       const detail = await getBookById(bookId);
      
//       // 2. Ambil Rekomendasi (hanya jika detail ditemukan)
//       let recs = [];
//       if (detail) {
//           recs = await getRecommendations(bookId);
//       }

//       setBook(detail);
//       setRecommend(recs);
//     } catch (error) {
//       console.error("Gagal memuat data buku:", error);
//       setBook(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadData(id);
//     window.scrollTo(0, 0); // Gulir ke atas saat memuat detail buku baru
//   }, [id, loadData]); // Dependensi [id, loadData] memastikan fungsi dipanggil saat ID berubah

//   // Handle Loading State
//   if (loading) 
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <p className="p-10 text-xl font-medium dark:text-gray-300">Memuat detail buku...</p>
//       </div>
//     );

//   // Handle Book Not Found
//   if (!book) 
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <p className="p-10 text-xl font-medium text-red-600">Buku dengan ID "{id}" tidak ditemukan.</p>
//       </div>
//     );
  
//   // --- Logika Konten untuk Display ---
//   // Penanganan jika content adalah null/undefined (dari API)
//   const content = book.content || "(Teks konten tidak tersedia)";
//   const isContentLong = content.length > CONTENT_LIMIT;
  
//   // Konten yang ditampilkan di halaman (ringkasan)
//   const displayedSummary = 
//     isContentLong 
//       ? content.slice(0, CONTENT_LIMIT) + "..." 
//       : content;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
//       <Header />

//       {/* FIXED BACK BUTTON */}
//       <button
//         onClick={() => navigate("/")}
//         className="fixed top-20 left-6 z-30 bg-white dark:bg-indigo-600 dark:hover:bg-indigo-800 text-gray-800 dark:text-white hover:bg-gray-400 hover:shadow-xl transition transform font-semibold px-4 py-2 rounded-lg shadow"
//       >
//         ← Home
//       </button>

//       {/* MAIN CONTENT */}
//       <main className="p-6 max-w-6xl mx-auto pt-20">
//         <div className="flex flex-col md:flex-row gap-10">

//           {/* COVER (Menggunakan book.cover dari API) */}
//           <img
//             src={book.cover} 
//             alt={book.title}
//             className="rounded-xl shadow-xl w-72 max-w-full flex-shrink-0 h-auto"
//           />

//           {/* DETAILS & CONTENT */}
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
//               {book.title}
//             </h1>

//             {/* Konten Ringkasan dengan perbaikan kerapian */}
//             <p className="mt-2 text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line text-justify">
//               {displayedSummary}
//             </p>

//             {/* Tombol READ MORE (Jika konten panjang) */}
//             {isContentLong && (
//               <button
//                 // Tombol ini hanya bertugas membuka modal
//                 onClick={() => setShowFullContent(true)}
//                 className="mt-4 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold rounded-lg px-5 py-2 transition"
//               >
//                 READ MORE
//               </button>
//             )}
            
//             {/* Pesan jika konten tidak tersedia */}
//              {content === "(Teks konten tidak tersedia)" && (
//                 <p className="mt-4 text-sm text-red-500">File teks konten tidak dapat dimuat dari backend.</p>
//             )}
//           </div>
//         </div>

//         {/* RECOMMENDATION (Menggunakan state 'recommend' dari API) */}
//         {recommend.length > 0 && (
//           <>
//             <h2 className="mt-16 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
//               Buku Serupa yang Direkomendasikan: <br /> 
//               <span className='text-indigo-600 dark:text-indigo-400'>{book.title}</span>
//             </h2>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto mt-8">
//               {/* Loop rekomendasi dari API */}
//               {recommend.map(b => (
//                 <BookCard key={b.id} book={b} />
//               ))}
//             </div>
//           </>
//         )}
//       </main>

//       <Footer />

//       {/* MODAL FULL CONTENT (Pop-up yang bisa di-scroll) */}
//       {showFullContent && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4"
//           // Mencegah scroll body saat modal aktif
//           onWheel={(e) => e.stopPropagation()} 
//         >
//           <div className="bg-white dark:bg-gray-800 p-6 max-w-3xl w-full rounded-lg shadow-xl max-h-[90vh] overflow-y-auto relative"> 
            
//             <button
//               onClick={() => setShowFullContent(false)}
//               className="absolute top-4 right-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-2xl font-bold transition-colors duration-200 p-1"
//               aria-label="Tutup Detail Konten Penuh"
//             >
//               ✕
//             </button>

//             <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 pr-10">
//               {book.title} - Konten Penuh
//             </h3>
            
//             {/* Konten PENUH dari API dengan perbaikan kerapian */}
//             <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line text-justify">
//               {content} 
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookDetail;

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