// // // src/frontend/components/Modals/SearchByContentModal.jsx
// // import React, { useState } from 'react';
// // import { searchBooksByContent } from '../../api/bookApi';

// // const SearchByContentModal = ({ isOpen, onClose, onSearchComplete }) => {
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   if (!isOpen) return null;

// //   const handleFileChange = (event) => {
// //     const file = event.target.files[0];
    
// //     if (!file) return;

// //     // Validasi tipe file
// //     if (!file.name.endsWith('.txt')) {
// //       setError('Format file harus .txt');
// //       return;
// //     }

// //     // Validasi ukuran file (max 2MB)
// //     if (file.size > 2 * 1024 * 1024) {
// //       setError('Ukuran file maksimal 2MB');
// //       return;
// //     }

// //     setSelectedFile(file);
// //     setError(null);
// //   };

// //   const handleSubmit = async () => {
// //     if (!selectedFile || loading) return;

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const results = await searchBooksByContent(selectedFile);

// //       if (!results || results.length === 0) {
// //         setError('Tidak ada buku yang cocok ditemukan');
// //         setLoading(false);
// //         return;
// //       }

// //       // Kirim hasil ke parent (Home.jsx)
// //       onSearchComplete(results);
      
// //       // Reset state dan tutup modal
// //       resetAndClose();

// //     } catch (error) {
// //       console.error("Pencarian konten gagal:", error);
// //       setError('Pencarian gagal. Periksa koneksi ke backend.');
// //       setLoading(false);
// //     }
// //   };

// //   const resetAndClose = () => {
// //     setSelectedFile(null);
// //     setError(null);
// //     setLoading(false);
// //     onClose();
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">

// //         {/* Header */}
// //         <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
// //           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
// //             Upload Book Content
// //           </h3>
// //           <button 
// //             onClick={resetAndClose} 
// //             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
// //           >
// //             <span className="text-2xl">&times;</span>
// //           </button>
// //         </div>

// //         {/* Body */}
// //         <div className="mt-4 space-y-4">

// //           <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700">
// //             <span className="text-4xl text-gray-400">📄</span>
// //             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
// //               Upload File: .txt
// //             </p>

// //             <input
// //               type="file"
// //               accept=".txt"
// //               onChange={handleFileChange}
// //               className="mt-3 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
// //             />

// //             {selectedFile && (
// //               <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
// //                 📎 {selectedFile.name}
// //               </p>
// //             )}
// //           </div>

// //           {/* Error Message */}
// //           {error && (
// //             <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
// //               <p className="text-sm text-red-700 dark:text-red-400 text-center">
// //                 {error}
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer */}
// //         <div className="mt-6 flex gap-3">
// //           <button
// //             onClick={resetAndClose}
// //             className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
// //                      text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
// //                      font-semibold transition"
// //           >
// //             Batal
// //           </button>
// //           <button
// //             onClick={handleSubmit}
// //             disabled={loading || !selectedFile}
// //             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition
// //               ${loading || !selectedFile
// //                 ? 'bg-gray-400 cursor-not-allowed text-white'
// //                 : 'bg-indigo-600 hover:bg-indigo-700 text-white'
// //               }`}
// //           >
// //             {loading ? 'Mencari...' : 'Cari Buku'}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SearchByContentModal;

// // src/components/modals/SearchByContentModal.jsx
// import React, { useState } from 'react';
// import { searchBooksByContent } from '../../api/bookApi';

// const SearchByContentModal = ({ isOpen, onClose, onSearchComplete }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   if (!isOpen) return null;

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
    
//     console.log("[DEBUG] File selected:", file);
    
//     if (!file) return;

//     // Validasi tipe file
//     if (!file.name.endsWith('.txt')) {
//       setError('Format file harus .txt');
//       return;
//     }

//     // Validasi ukuran file (max 2MB)
//     if (file.size > 2 * 1024 * 1024) {
//       setError('Ukuran file maksimal 2MB');
//       return;
//     }

//     // Validasi file tidak kosong
//     if (file.size === 0) {
//       setError('File tidak boleh kosong');
//       return;
//     }

//     setSelectedFile(file);
//     setError(null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile || loading) return;

//     console.log("[DEBUG] Starting search with file:", selectedFile.name);
    
//     setLoading(true);
//     setError(null);

//     try {
//       const results = await searchBooksByContent(selectedFile);

//       console.log("[DEBUG] Search completed, results:", results);

//       if (!results || results.length === 0) {
//         setError('Tidak ada buku yang cocok ditemukan');
//         setLoading(false);
//         return;
//       }

//       // Kirim hasil ke parent (Home.jsx)
//       onSearchComplete(results);
      
//       // Reset state dan tutup modal
//       resetAndClose();

//     } catch (error) {
//       console.error("[ERROR] Pencarian konten gagal:", error);
//       setError(`Pencarian gagal: ${error.message || 'Periksa koneksi ke backend'}`);
//       setLoading(false);
//     }
//   };

//   const resetAndClose = () => {
//     setSelectedFile(null);
//     setError(null);
//     setLoading(false);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">

//         {/* Header */}
//         <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Upload Book Content
//           </h3>
//           <button 
//             onClick={resetAndClose} 
//             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
//           >
//             <span className="text-2xl">&times;</span>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="mt-4 space-y-4">

//           <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700">
//             <span className="text-4xl text-gray-400">📄</span>
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Upload File: .txt
//             </p>
//             <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
//               Maksimal 2MB
//             </p>

//             <input
//               type="file"
//               accept=".txt"
//               onChange={handleFileChange}
//               className="mt-3 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
//             />

//             {selectedFile && (
//               <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
//                 <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
//                   📎 {selectedFile.name}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {(selectedFile.size / 1024).toFixed(2)} KB
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
//               <p className="text-sm text-red-700 dark:text-red-400 text-center">
//                 ⚠️ {error}
//               </p>
//             </div>
//           )}

//           {/* Loading Indicator */}
//           {loading && (
//             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 rounded-lg">
//               <p className="text-sm text-blue-700 dark:text-blue-400 text-center">
//                 🔍 Mencari buku dengan konten serupa...
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-6 flex gap-3">
//           <button
//             onClick={resetAndClose}
//             disabled={loading}
//             className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
//                      font-semibold transition
//                      ${loading 
//                        ? 'opacity-50 cursor-not-allowed' 
//                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                      }`}
//           >
//             Batal
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || !selectedFile}
//             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition
//               ${loading || !selectedFile
//                 ? 'bg-gray-400 cursor-not-allowed text-white'
//                 : 'bg-indigo-600 hover:bg-indigo-700 text-white'
//               }`}
//           >
//             {loading ? 'Mencari...' : 'Cari Buku'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchByContentModal;

// src/components/modals/SearchByContentModal.jsx
import React, { useState } from 'react';
import { searchBooksByContent } from '../../api/bookApi';

const SearchByContentModal = ({ isOpen, onClose, onSearchComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    console.log("[MODAL] File selected:", file);
    
    if (!file) {
      console.log("[MODAL] No file selected");
      return;
    }

    // Validasi tipe file
    if (!file.name.endsWith('.txt')) {
      const msg = 'Format file harus .txt';
      console.error("[MODAL]", msg);
      setError(msg);
      return;
    }

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      const msg = 'Ukuran file maksimal 2MB';
      console.error("[MODAL]", msg);
      setError(msg);
      return;
    }

    // Validasi file tidak kosong
    if (file.size === 0) {
      const msg = 'File tidak boleh kosong';
      console.error("[MODAL]", msg);
      setError(msg);
      return;
    }

    console.log("[MODAL] ✓ File validation passed");
    setSelectedFile(file);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.warn("[MODAL] Submit clicked but no file selected");
      return;
    }
    
    if (loading) {
      console.warn("[MODAL] Already loading, ignoring submit");
      return;
    }

    console.log("[MODAL] Starting search...");
    
    setLoading(true);
    setError(null);

    try {
      const results = await searchBooksByContent(selectedFile);

      console.log("[MODAL] Search completed, got", results.length, "results");

      if (!results || results.length === 0) {
        const msg = 'Tidak ada buku yang cocok ditemukan';
        console.warn("[MODAL]", msg);
        setError(msg);
        setLoading(false);
        return;
      }

      console.log("[MODAL] ✓ Calling onSearchComplete with results");
      onSearchComplete(results);
      
      console.log("[MODAL] ✓ Closing modal");
      resetAndClose();

    } catch (error) {
      console.error("[MODAL] Search failed:", error);
      const errorMsg = error.message || 'Pencarian gagal. Periksa koneksi ke backend.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    console.log("[MODAL] Resetting and closing");
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
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition disabled:opacity-50"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4">

          <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700">
            <span className="text-4xl text-gray-400">📄</span>
            <p className="mt-2 text-sm text-indigo-700 dark:text-gray-500">
              Upload File: .txt
            </p>

            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-3 block mx-auto text-sm text-gray-900 dark:text-gray-100 cursor-pointer disabled:opacity-50"
            />

            {selectedFile && (
              <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  📎 {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Mencari buku dengan konten serupa...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={resetAndClose}
            disabled={loading}
            className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     font-semibold transition
                     ${loading 
                       ? 'opacity-50 cursor-not-allowed' 
                       : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                     }`}
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
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Mencari...
              </span>
            ) : (
              'Find Book'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchByContentModal;