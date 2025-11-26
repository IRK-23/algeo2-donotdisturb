// src/frontend/components/Modals/SearchByContentModal.jsx
import React, { useState } from 'react';
// import { searchBooksByContent } from '../../api/bookApi'; // Uncomment saat fungsi API dibuat

const SearchByContentModal = ({ isOpen, onClose, onSearchComplete }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Menentukan apakah tombol Search aktif (minimal ada input teks atau file)
  const isSearchDisabled = loading || (!inputText.trim() && !selectedFile);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setInputText(''); // Reset input teks jika file dipilih
  };

  const handleSubmit = async () => {
    // Tentukan mode pencarian
    const query = selectedFile || inputText.trim();
    if (!query) return;

    setLoading(true);
    // ⚠️ TODO: Ganti dengan panggilan API yang sebenarnya
    try {
      // const results = await searchBooksByContent(query); 
      // Karena belum ada, kita simulasikan:
      await new Promise(resolve => setTimeout(resolve, 800));
      const simulatedResults = [{ id: 10, title: "Result by Content", author: "AI", cover: "https://picsum.photos/200/300?random=10" }];
      
      onSearchComplete(simulatedResults); 
      onClose();
    } catch (error) {
      console.error("Pencarian konten gagal:", error);
      alert("Pencarian gagal.");
    } finally {
      setLoading(false);
      setInputText('');
      setSelectedFile(null);
    }
  };

  return (
    // Backdrop / Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      {/* Modal Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm mx-4 transform transition-all">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Book Content
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body Modal */}
        <div className="mt-4 space-y-5">

            {/* Opsi 2: Upload File */}
            <div className="p-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700 relative">
                <span className="text-4xl text-gray-400">☁️</span> {/* Ikon Cloud/Upload */}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Upload File: .txt
                </p>
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="mt-2 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                />
                 {selectedFile && (
                    <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        File terpilih: {selectedFile.name}
                    </p>
                  )}
            </div>
        </div>

        {/* Footer Modal (Tombol Aksi) */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSearchDisabled}
            className={`px-6 py-2 rounded-lg font-semibold transition w-full
                        ${isSearchDisabled ? 'bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {loading ? 'Mencari...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchByContentModal;