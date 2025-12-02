// // src/frontend/components/Modals/SearchByContentModal.jsx
// import React, { useState } from 'react';
// // import { searchBooksByContent } from '../../api/bookApi'; // Uncomment saat fungsi API dibuat

// const SearchByContentModal = ({ isOpen, onClose, onSearchComplete }) => {
//   const [inputText, setInputText] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   // Menentukan apakah tombol Search aktif (minimal ada input teks atau file)
//   const isSearchDisabled = loading || (!inputText.trim() && !selectedFile);

//   if (!isOpen) return null;

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setInputText(''); // Reset input teks jika file dipilih
//   };

//   const handleSubmit = async () => {
//     // Tentukan mode pencarian
//     const query = selectedFile || inputText.trim();
//     if (!query) return;

//     setLoading(true);
//     // ⚠️ TODO: Ganti dengan panggilan API yang sebenarnya
//     try {
//       // const results = await searchBooksByContent(query); 
//       // Karena belum ada, kita simulasikan:
//       await new Promise(resolve => setTimeout(resolve, 800));
//       const simulatedResults = [{ id: 10, title: "Result by Content", author: "AI", cover: "https://picsum.photos/200/300?random=10" }];
      
//       onSearchComplete(simulatedResults); 
//       onClose();
//     } catch (error) {
//       console.error("Pencarian konten gagal:", error);
//       alert("Pencarian gagal.");
//     } finally {
//       setLoading(false);
//       setInputText('');
//       setSelectedFile(null);
//     }
//   };

//   return (
//     // Backdrop / Overlay
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
//       {/* Modal Box */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm mx-4 transform transition-all">
        
//         {/* Header Modal */}
//         <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700">
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Upload Book Content
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
//             <span className="text-2xl">&times;</span>
//           </button>
//         </div>

//         {/* Body Modal */}
//         <div className="mt-4 space-y-5">

//             {/* Opsi 2: Upload File */}
//             <div className="p-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700 relative">
//                 <span className="text-4xl text-gray-400">☁️</span> {/* Ikon Cloud/Upload */}
//                 <p className="mt-2 text-sm text-indigo-600 dark:text-gray-400">
//                     Upload File: .txt
//                 </p>
//                 <input
//                     type="file"
//                     accept=".txt"
//                     onChange={handleFileChange}
//                     className="mt-2 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
//                 />
//                  {selectedFile && (
//                     <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
//                         File terpilih: {selectedFile.name}
//                     </p>
//                   )}
//             </div>
//         </div>

//         {/* Footer Modal (Tombol Aksi) */}
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={handleSubmit}
//             disabled={isSearchDisabled}
//             className={`px-6 py-2 rounded-lg font-semibold transition w-full
//                         ${isSearchDisabled ? 'text-white bg-indigo-600 dark:bg-indigo-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
//           >
//             {loading ? 'Mencari...' : 'Search'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchByContentModal;

// src/frontend/components/Modals/SearchByContentModal.jsx
// src/frontend/components/Modals/SearchByContentModal.jsx
import React, { useState } from 'react';
import { searchBooksByContent } from '../../api/bookApi';

const SearchByContentModal = ({ isOpen, onClose, onSearchComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validasi tipe file
    if (!file.name.endsWith('.txt')) {
      setError('Format file harus .txt');
      return;
    }

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || loading) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchBooksByContent(selectedFile);

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
      console.error("Pencarian konten gagal:", error);
      setError('Pencarian gagal. Periksa koneksi ke backend.');
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSelectedFile(null);
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
            Upload Book Content
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

          <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700">
            <span className="text-4xl text-gray-400">📄</span>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Upload File: .txt
            </p>

            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="mt-3 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            />

            {selectedFile && (
              <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                📎 {selectedFile.name}
              </p>
            )}
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
            Batal
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
            {loading ? 'Mencari...' : 'Cari Buku'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchByContentModal;
