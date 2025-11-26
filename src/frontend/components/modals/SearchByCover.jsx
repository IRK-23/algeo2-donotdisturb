// src/frontend/components/Modals/SearchByCoverModal.jsx
import React, { useState } from 'react';
import { searchBooksByCover } from '../../api/bookApi'; 

const SearchByCoverModal = ({ isOpen, onClose, onSearchComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tombol Cari hanya aktif jika file sudah dipilih dan tidak sedang loading
  const isSearchDisabled = loading || !selectedFile;

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    // Mengambil file pertama dari input
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (isSearchDisabled) return;

    setLoading(true);
    try {
      // 1. Memanggil fungsi API simulasi (menggunakan data bookApi.js)
      const results = await searchBooksByCover(selectedFile); 
      
      // 2. Mengirim hasil ke Home.jsx dan mereset tampilan
      onSearchComplete(results); 
      onClose(); // Tutup modal
    } catch (error) {
      console.error("Pencarian cover gagal:", error);
      alert("Pencarian gagal. Periksa koneksi ke backend.");
    } finally {
      setLoading(false);
      setSelectedFile(null); // Reset state
    }
  };

  return (
    // Backdrop / Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      {/* Modal Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm mx-4 transform transition-all">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-3 border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Book Cover
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body Modal (Input File Drag & Drop Style) */}
        <div className="mt-4">
            
            {/* Area Drop Zone / Input File */}
            <div className="p-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700 relative">
                <span className="text-4xl text-gray-400">☁️</span> {/* Ikon Upload */}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Upload File: .png, .jpg
                </p>

                {/* Input file yang overlay/tersembunyi */}
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="mt-2 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                />
                {selectedFile && (
                  <p className="mt=2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    File terpilih: {selectedFIle.name}
                  </p>
                )}
            </div>         
        </div>

        {/* Footer Modal (Tombol Aksi) */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSearchDisabled}
            className={`px-6 py-3 rounded-lg font-semibold transition w-full
                        ${isSearchDisabled ? 'bg-indigo-600 dark:bg-indigo-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {loading ? 'Mencari...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchByCoverModal;