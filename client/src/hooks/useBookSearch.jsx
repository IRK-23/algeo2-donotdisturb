// src/frontend/hooks/useBookSearch.js
import { useState, useEffect, useCallback } from 'react';
import { fetchAllBooks, searchBooksByTitle } from '../api/bookApi'; // Ambil fungsi API

// Hook ini akan menggantikan sebagian besar state dan logika di Home.jsx
const useBookSearch = () => {
    // --- STATE MANAGEMENT ---
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeQuery, setActiveQuery] = useState({ type: 'all', value: '' });

    // --- LOGIKA FETCH DATA UTAMA ---
    // Menggunakan useCallback untuk mencegah re-render yang tidak perlu
    const loadBooks = useCallback(async (page = 1, query = activeQuery) => {
        setLoading(true);
        let results = [];
        let total = 1;

        try {
            if (query.type === 'title') {
                // Pencarian judul tidak menggunakan pagination, jadi total halaman dianggap 1
                results = await searchBooksByTitle(query.value);
                total = 1; 
            } else {
                // Fetch untuk tampilan default atau pagination
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
    }, [activeQuery]); // Dependensi: hanya aktifkan saat activeQuery berubah

    // --- LOGIKA PENCARIAN & LOADING AWAL ---
    
    // Efek untuk memuat buku saat komponen pertama kali di-mount
    useEffect(() => {
        loadBooks(1, { type: 'all', value: '' });
    }, [loadBooks]); // Dependensi: loadBooks (menggunakan useCallback di atas)

    // Handler Submit Pencarian dari SearchBar
    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        const query = searchTerm.trim(); 

        if (!query) {
            // Jika query kosong, reset ke tampilan semua buku
            loadBooks(1, { type: 'all', value: '' });
        } else {
            // Jika ada query, lakukan pencarian judul
            loadBooks(1, { type: 'title', value: query });
        }
    };
    
    // Handler Pindah Halaman
    const handlePageChange = (page) => {
        loadBooks(page, activeQuery);
    };

    // Handler setelah Modal (Search by Cover/Content) selesai
    const handleModalSearchComplete = (results) => {
        setBooks(results);
        setTotalPages(1); 
        setCurrentPage(1);
        setActiveQuery({ type: 'modal', value: 'custom_search' });
    };

    // Export semua state, setter, dan handler yang dibutuhkan oleh komponen luar
    return {
        books,
        loading,
        currentPage,
        totalPages,
        searchTerm,
        isContentModalOpen: false, // State modal sebaiknya tetap di Home.jsx
        isCoverModalOpen: false,   // karena hanya Home.jsx yang menggunakan setIsXxxModalOpen
        activeQuery,
        setSearchTerm,
        handleSearchSubmit,
        handlePageChange,
        handleModalSearchComplete,
        loadBooks // Opsional, jika diperlukan dari luar
    };
};

export default useBookSearch;




