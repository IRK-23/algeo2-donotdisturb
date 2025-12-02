// src/frontend/components/Modals/SearchByCoverModal.jsx
import React, { useState } from 'react';
import { searchBooksByCover } from '../../api/bookApi'; 

const SearchByCoverModal = ({ isOpen, onClose, onSearchComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validasi tipe file
    if (!file.type.match('image/(png|jpeg|jpg)')) {
      setError('Format file harus PNG atau JPG');
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Buat preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || loading) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchBooksByCover(selectedFile);
      
      if (!results || results.length === 0) {
        setError('Tidak ada buku yang cocok ditemukan');
        setLoading(false);
        return;
      }

      // Kirim hasil ke parent (Home.jsx)
      onSearchComplete(results);
      
      // Reset state dan tutup modal
      resetAndClose();
      
    } catch (error) {
      console.error("Pencarian cover gagal:", error);
      setError('Pencarian gagal. Periksa koneksi ke backend.');
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Book Cover
          </h3>
          <button 
            onClick={resetAndClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4">
          
          {/* Upload Area */}
          <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700">
            
            {previewUrl ? (
              <div className="space-y-3">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-48 mx-auto rounded-lg shadow-md"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedFile.name}
                </p>
              </div>
            ) : (
              <>
                <span className="text-4xl text-gray-400">📷</span>
                <p className="mt-2 text-sm text-indigo-700 dark:text-gray-500">
                  Upload File: .png, .jpg
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="mt-3 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={resetAndClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                     font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition
              ${loading || !selectedFile
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            {loading ? 'Mencari...' : 'Find Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchByCoverModal;