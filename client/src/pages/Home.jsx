// src/pages/Home.jsx
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
  // --- STATE MANAGEMENT ---
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // untuk SearchBar
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState({ type: 'all', value: '' });

  // --- HELPERS / HANDLERS ---

  const loadBooks = async (page = 1, query = activeQuery) => {
      setLoading(true);
      let results = [];
      let total = 1;

      try {
          if (query.type === "title") {
              // Pencarian berdasarkan judul
              results = await searchBooksByTitle(query.value);
              total = 1; 
          } else {
              // Default: pagination
              const data = await fetchAllBooks(page);

              results = data.books ?? [];
              total = data.total ?? 1; // ✔️ Perbaikan: gunakan total, bukan totalPages
          }
      } catch (err) {
          console.error("Error loading books:", err);
      }

      setBooks(results);
      setTotalPages(total);
      setCurrentPage(page);
      setLoading(false);
  };

  // Handler untuk SearchBar (pencarian judul)
  const handleTitleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      // kosong => kembali ke semua buku (halaman 1)
      loadBooks(1, { type: 'all', value: '' });
    } else {
      // lakukan search by title (non-paging)
      loadBooks(1, { type: 'title', value: query });
    }
  };

  // Handler yang dipanggil oleh modal (cover/content) saat selesai mencari
  const handleModalSearch = (results) => {
    // results diharapkan array buku
    setBooks(results ?? []);
    setTotalPages(1);
    setCurrentPage(1);
    setActiveQuery({ type: 'modal', value: '' }); // tandai agar pagination tersembunyi
  };

  // Panggil saat pertama kali render
  useEffect(() => {
    loadBooks(1, { type: 'all', value: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Search bar utama */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchSubmit={handleTitleSearch}
        />

        {/* Opsi pencarian spesifik (trigger modal) */}
        <SearchOptions
          onCoverClick={() => setIsCoverModalOpen(true)}
          onContentClick={() => setIsContentModalOpen(true)}
        />

        {/* Judul daftar (bergantung pada activeQuery) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {activeQuery.type === 'title'
              ? `Hasil Pencarian: "${activeQuery.value}"`
              : activeQuery.type === 'modal'
              ? 'Hasil Pencarian Spesifik'
              : 'Koleksi Buku Terbaru'}
          </h2>

          {loading ? (
            <p className="text-center text-indigo-600 dark:text-indigo-400">Loading buku...</p>
          ) : books.length > 0 ? (
            <BookList books={books} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada buku ditemukan.</p>
          )}
        </div>

        {/* Pagination hanya tampil saat melihat semua koleksi (bukan saat search by title/modal) */}
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

      {/* Modal: Search by Cover */}
      <SearchByCoverModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onSearchComplete={(results) => {
          handleModalSearch(results);
          setIsCoverModalOpen(false);
        }}
      />

      {/* Modal: Search by Content */}
      <SearchByContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        onSearchComplete={(results) => {
          handleModalSearch(results);
          setIsContentModalOpen(false);
        }}
      />

      <Footer />
    </div>
  );
};

export default Home;

// import React, { useState, useEffect } from 'react';
// import Header from '../components/common/Header';
// import Footer from '../components/common/Footer';
// import SearchBar from '../components/SearchBar';
// import BookList from '../components/BookList';
// import SearchOptions from '../components/SearchOptions';
// import Pagination from '../components/common/Pagination';
// import SearchByCoverModal from '../components/modals/SearchByCover';
// import SearchByContentModal from '../components/modals/SearchByContent';
// import { fetchAllBooks, searchBooksByTitle } from '../api/bookApi';

// const Home = () => {
//   // --- STATE MANAGEMENT ---
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState(''); // untuk SearchBar
//   const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
//   const [isContentModalOpen, setIsContentModalOpen] = useState(false);
//   const [activeQuery, setActiveQuery] = useState({ type: 'all', value: '' });

//   // --- HELPERS / HANDLERS ---

//   // Fungsi utama untuk memuat buku (bisa dipanggil juga untuk hasil search)
//   const loadBooks = async (page = 1, query = activeQuery) => {
//     setLoading(true);
//     try {
//       let results = [];
//       let total = 1;

//       if (query.type === 'title') {
//         // Untuk pencarian judul, gunakan searchBooksByTitle (tanpa paging)
//         results = await searchBooksByTitle(query.value);
//         total = 1; // Pencarian berdasarkan judul tidak memerlukan paging, hanya 1 halaman
//       } else {
//         // Default: ambil semua buku dengan paging dari API
//         const data = await fetchAllBooks(page);
//         results = data.books ?? [];
//         total = data.totalPages ?? 1;
//       }

//       setBooks(results);
//       setTotalPages(total);
//       setCurrentPage(page);
//       setActiveQuery(query);
//     } catch (error) {
//       console.error('Gagal memuat buku:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handler untuk SearchBar (pencarian judul)
//   const handleTitleSearch = (e) => {
//     if (e && e.preventDefault) e.preventDefault();
//     const query = searchTerm.trim();

//     if (!query) {
//       // Kosong => kembali ke semua buku (halaman 1)
//       loadBooks(1, { type: 'all', value: '' });
//     } else {
//       // Lakukan pencarian berdasarkan judul (non-paging)
//       loadBooks(1, { type: 'title', value: query });
//     }
//   };

//   // Handler yang dipanggil oleh modal (cover/content) saat selesai mencari
//   const handleModalSearch = (results) => {
//     // results diharapkan array buku
//     setBooks(results ?? []);
//     setTotalPages(1); // Tidak perlu pagination pada modal
//     setCurrentPage(1);
//     setActiveQuery({ type: 'modal', value: '' }); // Tandai agar pagination tersembunyi
//   };

//   // Panggil saat pertama kali render
//   useEffect(() => {
//     loadBooks(1, { type: 'all', value: '' });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       {/* Header */}
//       <Header />

//       {/* Konten Utama */}
//       <main className="max-w-7xl mx-auto p-6">
//         {/* Search bar utama */}
//         <SearchBar
//           searchTerm={searchTerm}
//           onSearchTermChange={setSearchTerm}
//           onSearchSubmit={handleTitleSearch}
//         />

//         {/* Opsi pencarian spesifik (trigger modal) */}
//         <SearchOptions
//           onCoverClick={() => setIsCoverModalOpen(true)}
//           onContentClick={() => setIsContentModalOpen(true)}
//         />

//         {/* Judul daftar (bergantung pada activeQuery) */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//             {activeQuery.type === 'title'
//               ? `Hasil Pencarian: "${activeQuery.value}"`
//               : activeQuery.type === 'modal'
//               ? 'Hasil Pencarian Spesifik'
//               : 'Koleksi Buku Terbaru'}
//           </h2>

//           {loading ? (
//             <p className="text-center text-indigo-600 dark:text-indigo-400">Loading buku...</p>
//           ) : books.length > 0 ? (
//             <BookList books={books} />
//           ) : (
//             <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada buku ditemukan.</p>
//           )}
//         </div>

//         {/* Pagination hanya tampil saat melihat semua koleksi (bukan saat search by title/modal) */}
//         {activeQuery.type === 'all' && totalPages > 1 && (
//           <div className="mt-8">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={(page) => loadBooks(page, { type: 'all', value: '' })}
//             />
//           </div>
//         )}
//       </main>

//       {/* Modal: Search by Cover */}
//       <SearchByCoverModal
//         isOpen={isCoverModalOpen}
//         onClose={() => setIsCoverModalOpen(false)}
//         onSearchComplete={(results) => {
//           handleModalSearch(results);
//           setIsCoverModalOpen(false);
//         }}
//       />

//       {/* Modal: Search by Content */}
//       <SearchByContentModal
//         isOpen={isContentModalOpen}
//         onClose={() => setIsContentModalOpen(false)}
//         onSearchComplete={(results) => {
//           handleModalSearch(results);
//           setIsContentModalOpen(false);
//         }}
//       />

//       <Footer />
//     </div>
//   );
// };

// export default Home;
