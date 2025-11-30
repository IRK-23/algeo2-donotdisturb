
// const BOOKS_PER_PAGE = 10;

// // Contoh data buku yang disimulasikan
// const simulatedBooks = [
//   { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://picsum.photos/200/300?random=1" },
//   { id: 2, title: "1984", author: "George Orwell", cover: "https://picsum.photos/200/300?random=2" },
//   { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://picsum.photos/200/300?random=3" },
//   // ... tambahkan lebih banyak buku untuk tampilan awal
// ];

// // ----------------------------------------------------
// // FUNGSI PENCARIAN JUDUL (untuk Search Bar di Header)
// // ----------------------------------------------------
// export const searchBooksByTitle = async (query) => {
//   // Ganti URL ini dengan endpoint Python Anda
//   // const response = await fetch(`/api/search/title?q=${query}`);
//   // const data = await response.json();
  
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log(`Pencarian judul: ${query}`);
//       const results = simulatedBooks.filter(book => 
//         book.title.toLowerCase().includes(query.toLowerCase())
//       );
//       resolve({
//             books: books.length > 0 ? books : simulatedBooks.slice(0, BOOKS_PER_PAGE),
//             totalPages: Math.ceil(simulatedBooks.length / BOOKS_PER_PAGE) 
//       });
//     }, 500); // Simulasi loading 500ms
//   });
// };

// // ----------------------------------------------------
// // FUNGSI PENCARIAN COVER (untuk Modal Upload Gambar)
// // ----------------------------------------------------
// export const searchBooksByCover = async (imageFile) => {
//   const formData = new FormData();
//   formData.append('cover_image', imageFile);

//   // Ganti URL ini dengan endpoint Python yang menerima gambar
//   // const response = await fetch('/api/search/cover', {
//   //   method: 'POST',
//   //   body: formData,
//   // });
//   // const data = await response.json();

//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log(`Pencarian berdasarkan Cover: ${imageFile.name}`);
//       // Asumsi hasil pencarian dari cover juga mengembalikan array buku
//       resolve(simulatedBooks.slice(0, 2)); // Contoh 2 hasil
//     }, 1000); 
//   });
// };

// // ----------------------------------------------------
// // FUNGSI DEFAULT (untuk tampilan awal dan pagination)
// // ----------------------------------------------------
// export const fetchAllBooks = async (page = 1) => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         const startIndex = (page - 1) * 6;
//         const endIndex = startIndex + 6;
//         const books = simulatedBooks.slice(startIndex, endIndex);

//         resolve({
//             books: books.length > 0 ? books : simulatedBooks.slice(0, 6),
//             totalPages: Math.ceil(simulatedBooks.length / 6) // Asumsi 6 buku per halaman
//         });
//       }, 500);
//     });
// };

// src/frontend/api/bookApi.js

// const BOOKS_PER_PAGE = 10;

// // ✅ CONTOH DATA DENGAN 11 BUKU (Akan menghasilkan 2 halaman)
// // const simulatedBooks = [
// //   { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://picsum.photos/200/300?random=1" },
// //   { id: 2, title: "1984", author: "George Orwell", cover: "https://picsum.photos/200/300?random=2" },
// //   { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://picsum.photos/200/300?random=3" },
// //   { id: 4, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", cover: "https://picsum.photos/200/300?random=4" },
// //   { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", cover: "https://picsum.photos/200/300?random=5" },
// //   { id: 6, title: "Moby Dick", author: "Herman Melville", cover: "https://picsum.photos/200/300?random=6" },
// //   { id: 7, title: "War and Peace", author: "Leo Tolstoy", cover: "https://picsum.photos/200/300?random=7" },
// //   { id: 8, title: "The Odyssey", author: "Homer", cover: "https://picsum.photos/200/300?random=8" },
// //   { id: 9, title: "Jane Eyre", author: "Charlotte Bronte", cover: "https://picsum.photos/200/300?random=9" },
// //   { id: 10, title: "Wuthering Heights", author: "Emily Bronte", cover: "https://picsum.photos/200/300?random=10" },
// //   { id: 11, title: "The Little Prince", author: "Antoine de Saint-Exupéry", cover: "https://picsum.photos/200/300?random=11" },
// // ];

// // ----------------------------------------------------
// // FUNGSI PENCARIAN JUDUL (Diperbaiki)
// // ----------------------------------------------------
// export const searchBooksByTitle = async (query) => {
  
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log(`Pencarian judul: ${query}`);
//       const results = simulatedBooks.filter(book => 
//         book.title.toLowerCase().includes(query.toLowerCase())
//       );
//       // ✅ Hanya mengembalikan daftar hasil, tidak perlu pagination di sini
//       resolve(results); 
//     }, 500); 
//   });
// };

// // ----------------------------------------------------
// // FUNGSI PENCARIAN COVER (Mengirimkan file ke backend)
// // ----------------------------------------------------
// export const searchBooksByCover = async (imageFile) => {
//   const formData = new FormData();
//   formData.append('cover_image', imageFile);

//   // ⚠️ GANTI URL INI dengan endpoint Python Anda yang menerima file dan menyimpannya
//   try {
//     const response = await fetch('/api/query_cover/search', { // <-- Contoh endpoint
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Asumsi: Backend Python Anda akan mengembalikan JSON hasil pencarian
//     const data = await response.json(); 
//     return data; // Data ini akan menjadi 'results' di Home.jsx
    
//   } catch (error) {
//     console.error("API Call Gagal:", error);
//     // Jika API gagal, kembalikan hasil simulasi untuk mencegah crash front end sementara
//     return simulatedBooks.slice(0, 2); 
//   }
// };

// // ----------------------------------------------------
// // FUNGSI DEFAULT (Diperbarui untuk 10 buku per halaman)
// // ----------------------------------------------------
// export const fetchAllBooks = async (page = 1) => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         // ✅ Menggunakan BOOKS_PER_PAGE yang baru (10)
//         const startIndex = (page - 1) * BOOKS_PER_PAGE; 
//         const endIndex = startIndex + BOOKS_PER_PAGE;
//         const books = simulatedBooks.slice(startIndex, endIndex);

//         resolve({
//             books: books, // Hanya kirim buku yang di-slice
//             // ✅ Perhitungan total halaman menggunakan 10 buku/halaman: ceil(11/10) = 2
//             totalPages: Math.ceil(simulatedBooks.length / BOOKS_PER_PAGE) 
//         });
//       }, 500);
//     });
// };


// // src/api/bookApi.js

// export const simulatedBooks = [
//   {
//     id: 1,
//     title: "They Both Die at the End",
//     author: "Adam Silvera",
//     cover:
//       "https://picsum.photos/200/300?random=1",
//   },
//   {
//     id: 2,
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     cover:
//       "https://picsum.photos/200/300?random=2",
//   },
//   {
//     id: 3,
//     title: "Atomic Habits",
//     author: "James Clear",
//     cover:
//       "https://picsum.photos/200/300?random=3",
//   },
//   {
//     id: 4,
//     title: "The Alchemist",
//     author: "Paulo Coelho",
//     cover:
//       "https://picsum.photos/200/300?random=4",
//   },
//   {
//     id: 5,
//     title: "The Subtle Art of Not Giving a F*ck",
//     author: "Mark Manson",
//     cover:
//       "https://picsum.photos/200/300?random=5",
//   },
//   {
//     id: 6,
//     title: "Norwegian Wood",
//     author: "Haruki Murakami",
//     cover:
//       "https://picsum.photos/200/300?random=6",
//   },
//   {
//     id: 7,
//     title: "The Famous Five: Five on a Treasure Island",
//     author: "Enid Blyton",
//     cover:
//       "https://picsum.photos/200/300?random=7",
//   },
//   {
//     id: 8,
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     cover:
//       "https://picsum.photos/200/300?random=8",
//   },
//   {
//     id: 9,
//     title: "1984",
//     author: "George Orwell",
//     cover:
//       "https://picsum.photos/200/300?random=9",
//   },
//   {
//     id: 10,
//     title: "The Silent Patient",
//     author: "Alex Michaelides",
//     cover:
//       "https://picsum.photos/200/300?random=10",
//   },
//   {
//     id: 11,
//     title: "The Little Prince",
//     author: "Antoine de Saint-Exupéry",
//     cover:
//       "https://picsum.photos/200/300?random=11",
//   },
// ];

// src/frontend/api/bookApi.js

// Konstanta global untuk pagination
const BOOKS_PER_PAGE = 10;

// ✅ DEFINISI SIMULATEDBOOKS HARUS HANYA SATU KALI DAN DIAKHIR FILE INI
// Dipindahkan dari bawah, sekarang ini adalah data utama.
export const simulatedBooks = [
  { id: 1, title: "They Both Die at the End", author: "Adam Silvera", cover: "https://picsum.photos/200/300?random=1" },
  { id: 2, title: "The Midnight Library", author: "Matt Haig", cover: "https://picsum.photos/200/300?random=2" },
  { id: 3, title: "Atomic Habits", author: "James Clear", cover: "https://picsum.photos/200/300?random=3" },
  { id: 4, title: "The Alchemist", author: "Paulo Coelho", cover: "https://picsum.photos/200/300?random=4" },
  { id: 5, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", cover: "https://picsum.photos/200/300?random=5" },
  { id: 6, title: "Norwegian Wood", author: "Haruki Murakami", cover: "https://picsum.photos/200/300?random=6" },
  { id: 7, title: "The Famous Five: Five on a Treasure Island", author: "Enid Blyton", cover: "https://picsum.photos/200/300?random=7" },
  { id: 8, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://picsum.photos/200/300?random=8" },
  { id: 9, title: "1984", author: "George Orwell", cover: "https://picsum.photos/200/300?random=9" },
  { id: 10, title: "The Silent Patient", author: "Alex Michaelides", cover: "https://picsum.photos/200/300?random=10" },
  { id: 11, title: "The Little Prince", author: "Antoine de Saint-Exupéry", cover: "https://picsum.photos/200/300?random=11" },
];


// ----------------------------------------------------
// FUNGSI PENCARIAN JUDUL (SIAP UNTUK DIGANTI DENGAN FETCH)
// ----------------------------------------------------
export const searchBooksByTitle = async (query) => {
  // 💡 GANTI SIMULASI INI DENGAN: fetch(`/api/search/title?q=${query}`)
  
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[SIMULASI] Pencarian judul: ${query}`);
      const results = simulatedBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      // Mengembalikan hasil langsung (tanpa pagination)
      resolve(results); 
    }, 500); 
  });
};

// ----------------------------------------------------
// FUNGSI PENCARIAN COVER (Panggilan HTTP POST Nyata)
// ----------------------------------------------------
export const searchBooksByCover = async (imageFile) => {
  const formData = new FormData();
  formData.append('cover_image', imageFile);

  // ⚠️ GANTI PORT DAN PATH INI DENGAN SERVER PYTHON ANDA
  const API_URL = 'http://localhost:5000/api/query_cover'; 

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        throw new Error(`Permintaan API gagal! Status: ${response.status}`);
    }

    const data = await response.json(); 
    return data;
    
  } catch (error) {
    console.error("Gagal melakukan HTTP POST ke backend:", error);
    // Fallback: Jika backend gagal, kembalikan data simulasi
    return { books: simulatedBooks.slice(0, 2), totalPages: 1 };
  }
};

// ----------------------------------------------------
// FUNGSI DEFAULT (UNTUK TAMPILAN AWAL DAN PAGINATION)
// ----------------------------------------------------
export const fetchAllBooks = async (page = 1) => {
  // 💡 GANTI SIMULASI INI DENGAN: fetch(`/api/books?page=${page}&limit=${BOOKS_PER_PAGE}`)
  
  return new Promise(resolve => {
    setTimeout(() => {
      const startIndex = (page - 1) * BOOKS_PER_PAGE; 
      const endIndex = startIndex + BOOKS_PER_PAGE;
      const books = simulatedBooks.slice(startIndex, endIndex);

      resolve({
          books: books,
          totalPages: Math.ceil(simulatedBooks.length / BOOKS_PER_PAGE) 
      });
    }, 500);
  });
};

// ----------------------------------------------------
// FUNGSI PENCARIAN CONTENT (Belum ada, tapi harus dibuat)
// ----------------------------------------------------
/*
export const searchBooksByContent = async (queryData) => {
    const API_URL = 'http://localhost:5000/api/query_content'; sesuai server python
    // ... (logic untuk FormData dan fetch)
}
*/