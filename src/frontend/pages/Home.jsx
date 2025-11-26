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
    const [searchTerm, setSearchTerm] = useState(''); // State untuk Search Bar
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [activeQuery, setActiveQuery] = useState({ type: 'all', value: '' });

    // --- HANDLERS & LOGIKA ---

    // LOGIKA FETCH DATA UTAMA
    const loadBooks = async (page = 1, query = activeQuery) => {
        setLoading(true);
        let results = [];
        let total = 1;

        try {
            if (query.type === 'title') {
                results = await searchBooksByTitle(query.value);
                total = 1;
            } else {
                const data = await fetchAllBooks(page);
                results = data.books;
                total = data.totalPages;
            }
            
            setBooks(results);
            setTotalPages(total);
            setCurrentPage(page);
            setActiveQuery(query);
        } catch (error) {
            console.error("Gagal memuat buku:", error);
        } finally {
            setLoading(false);
        }
    };

    // HANDLER PENCARIAN DARI SEARCH BAR
    const handleTitleSearch = (e) => {
        e.preventDefault(); 
        const query = searchTerm.trim(); 

        if (!query) {
            loadBooks(1, { type: 'all', value: '' });
        } else {
            loadBooks(1, { type: 'title', value: query });
        }
    };

    // HANDLER PENCARIAN DARI MODAL
    const handleModalSearch = (results) => {
        setBooks(results);
        setTotalPages(1); 
        setCurrentPage(1);
    }

    // Panggil saat komponen pertama kali di-render
    useEffect(() => {
        loadBooks(1, { type: 'all', value: '' });
    }, []);

    // --- RENDER JSX ---
    return (
        // Wrapper Utama
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* 1. HEADER (Minimalis) */}
            <Header /> 

            {/* 2. KONTEN UTAMA */}
            <main className="max-w-7xl mx-auto p-6">
                
                {/* Search Bar Utama */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    onSearchSubmit={handleTitleSearch}
                />

                {/* 3. Opsi Pencarian Spesifik (SearchOptions) */}
                <SearchOptions 
                    onCoverClick={() => setIsCoverModalOpen(true)}
                    onContentClick={() => setIsContentModalOpen(true)}
                />
                
                {/* Bagian 2: Tampilan Daftar Buku */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        {activeQuery.type === 'title' ? `Hasil Pencarian: "${activeQuery.value}"` : 'Koleksi Buku Terbaru'}
                    </h2>

                    {/* ⚠️ HAPUS KOMENTAR KODE INI */}
                    {loading ? (
                        <p className="text-center text-indigo-600 dark:text-indigo-400">Loading buku...</p>
                    ) : books.length > 0 ? (
                        <BookList books={books} />
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada buku ditemukan.</p>
                    )}
                    
                </div>

                {/* // Bagian 3: Pagination */}
                {activeQuery.type === 'all' && totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => loadBooks(page)} // Memanggil logika fetch data utama
                        />
                    </div>
                )}
            </main>

            {/* 5. MODAL (Dipanggil di luar <main>) */}
            <SearchByCoverModal 
                isOpen={isCoverModalOpen} 
                onClose={() => setIsCoverModalOpen(false)}
                onSearchComplete={handleModalSearch}
            />

            <SearchByContentModal 
                isOpen={isContentModalOpen} 
                onClose={() => setIsContentModalOpen(false)}
                onSearchComplete={handleModalSearch}
            />

            {/* Footer */}
            <Footer />

        </div>

        
    );
};

export default Home;