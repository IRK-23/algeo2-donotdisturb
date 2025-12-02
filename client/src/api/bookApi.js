
// src/frontend/api/bookApi.js

// Konstanta global untuk pagination
// const BOOKS_PER_PAGE = 10;

// ✅ DEFINISI SIMULATEDBOOKS HARUS HANYA SATU KALI DAN DIAKHIR FILE INI
// Dipindahkan dari bawah, sekarang ini adalah data utama.
// export const simulatedBooks = [
//   { id: 1, title: "They Both Die at the End", author: "Adam Silvera", cover: "https://picsum.photos/200/300?random=1" },
//   { id: 2, title: "The Midnight Library", author: "Matt Haig", cover: "https://picsum.photos/200/300?random=2" },
//   { id: 3, title: "Atomic Habits", author: "James Clear", cover: "https://picsum.photos/200/300?random=3" },
//   { id: 4, title: "The Alchemist", author: "Paulo Coelho", cover: "https://picsum.photos/200/300?random=4" },
//   { id: 5, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", cover: "https://picsum.photos/200/300?random=5" },
//   { id: 6, title: "Norwegian Wood", author: "Haruki Murakami", cover: "https://picsum.photos/200/300?random=6" },
//   { id: 7, title: "The Famous Five: Five on a Treasure Island", author: "Enid Blyton", cover: "https://picsum.photos/200/300?random=7" },
//   { id: 8, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://picsum.photos/200/300?random=8" },
//   { id: 9, title: "1984", author: "George Orwell", cover: "https://picsum.photos/200/300?random=9" },
//   { id: 10, title: "The Silent Patient", author: "Alex Michaelides", cover: "https://picsum.photos/200/300?random=10" },
//   { id: 11, title: "The Little Prince", author: "Antoine de Saint-Exupéry", cover: "https://picsum.photos/200/300?random=11" },
// ];


// ----------------------------------------------------
// FUNGSI PENCARIAN JUDUL (SIAP UNTUK DIGANTI DENGAN FETCH)
// ----------------------------------------------------
// export const searchBooksByTitle = async (query) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: query }), // Mengirim query sebagai JSON
//     });

//     if (!response.ok) {
//       throw new Error(`Permintaan gagal! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.results; // Mengembalikan hasil pencarian berdasarkan query
//   } catch (error) {
//     console.error("Gagal melakukan pencarian judul:", error);
//     return []; // Mengembalikan array kosong jika terjadi error
//   }
// };

// // ----------------------------------------------------
// // FUNGSI PENCARIAN COVER (Panggilan HTTP POST Nyata)
// // ----------------------------------------------------
// export const searchBooksByCover = async (imageFile) => {
//   const formData = new FormData();
//   formData.append('file', imageFile); // Menambahkan gambar yang di-upload ke FormData

//   const API_URL = 'http://localhost:5000/api/search/image'; // URL sesuai dengan endpoint di backend Flask

//   try {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       body: formData, // Mengirimkan file dalam body
//     });

//     if (!response.ok) {
//       throw new Error(`Permintaan gagal! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.results; // Mengembalikan hasil pencarian berdasarkan cover
//   } catch (error) {
//     console.error("Gagal melakukan pencarian berdasarkan cover:", error);
//     return []; // Mengembalikan array kosong jika terjadi error
//   }
// };

// // ----------------------------------------------------
// // FUNGSI DEFAULT (UNTUK TAMPILAN AWAL DAN PAGINATION)
// // ----------------------------------------------------
// export const fetchAllBooks = async (page = 1) => {
//   try {
//     const response = await fetch(`http://localhost:5000/api/books?page=${page}`);
//     if (!response.ok) {
//       throw new Error(`Permintaan gagal! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return {
//       books: data.results, // Hasil buku dari API
//       totalPages: data.total_pages, // Total halaman untuk pagination
//     };
//   } catch (error) {
//     console.error("Gagal mengambil daftar buku:", error);
//     return { books: [], totalPages: 1 }; // Mengembalikan data kosong jika terjadi error
//   }
// };

// // ----------------------------------------------------
// // FUNGSI PENCARIAN CONTENT (Belum ada, tapi harus dibuat)
// // ----------------------------------------------------
// export const searchBooksByContent = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);  // Menambahkan file teks yang dipilih

//   const API_URL = 'http://localhost:5000/api/search/text'; // URL sesuai dengan endpoint di backend Flask

//   try {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       body: formData,  // Mengirimkan file dalam body
//     });

//     if (!response.ok) {
//       throw new Error(`Permintaan gagal! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.results;  // Mengembalikan hasil pencarian berdasarkan konten
//   } catch (error) {
//     console.error("Gagal melakukan pencarian berdasarkan konten:", error);
//     return [];  // Mengembalikan array kosong jika terjadi error
//   }
// };

const BASE_URL = "http://localhost:5000/api";

// ======================================================
// 1. SEARCH TITLE
// ======================================================
export const searchBooksByTitle = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    if (!res.ok) throw new Error(res.status);

    const data = await res.json();
    return data.results ?? [];
  } catch (err) {
    console.error("Title search error:", err);
    return [];
  }
};

// ======================================================
// 2. SEARCH BY IMAGE
// ======================================================
export const searchBooksByCover = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://localhost:5000/api/search/image", {
    method: "POST",
    body: form
  });

  if (!res.ok) throw new Error("Search by image failed");

  const data = await res.json();
  return data.results;
};

// ======================================================
// 3. SEARCH BY TEXT
// ======================================================
export const searchBooksByContent = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://localhost:5000/api/search/text", {
    method: "POST",
    body: form
  });

  if (!res.ok) throw new Error("Search by text failed");

  const data = await res.json();
  return data.results; // backend returns {count, results}
};

// ======================================================
// 4. GET ALL BOOKS (Pagination)
// ======================================================
export const fetchAllBooks = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/books?page=${page}`);

    if (!res.ok) throw new Error(res.status);

    const data = await res.json();

    return {
      books: data.results ?? [],
      total: data.total_pages ?? 1
    };
  } catch (err) {
    console.error("Get all books error:", err);
    return { books: [], total: 1 };
  }
};

// ======================================================
// 5. GET BOOK BY ID
// ======================================================
export const getBookById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/book/${id}`); // Memanggil endpoint ringkasan
    if (!res.ok) throw new Error(res.status);

    const data = await res.json();

    return {
      id: data.id,
      title: data.title,
      cover: data.cover,
      // Mengambil key baru dari backend
      summary: data.text_summary, 
      hasFullText: data.has_full_text 
    };
  } catch (err) {
    console.error("Get book error:", err);
    return null;
  }
};

// ======================================================
// 6. GET RECOMMENDATIONS
// ======================================================
export const getRecommendations = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/recommend/${id}`);

    if (!res.ok) throw new Error(res.status);

    const data = await res.json();
    return data.results ?? [];
  } catch (err) {
    console.error("Recommendation error:", err);
    return [];
  }
};

// ======================================================
// 7. GET FULL TEXT 
// ======================================================
export const getBookFullText = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/book/${id}/fulltext`); // Memanggil endpoint teks penuh
        if (!res.ok) throw new Error(res.status);
        
        const data = await res.json();
        // Backend mengirimkan {'text': 'konten penuh'}
        return data.text || "(Gagal memuat teks penuh)";
    } catch (err) {
        console.error("Get full text error:", err);
        return "(Gagal memuat teks penuh karena error koneksi)";
    }
};