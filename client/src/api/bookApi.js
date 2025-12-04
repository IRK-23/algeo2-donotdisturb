

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
  console.log("[DEBUG] ===== SEARCH BY CONTENT START =====");
  console.log("[DEBUG] File:", {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });

  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("[DEBUG] Sending POST request to:", `${BASE_URL}/search/text`);

    const response = await fetch(`${BASE_URL}/search/text`, {
      method: "POST",
      body: formData,
      // Jangan set Content-Type, biarkan browser yang set untuk FormData
    });

    console.log("[DEBUG] Response received:");
    console.log("[DEBUG] - Status:", response.status);
    console.log("[DEBUG] - StatusText:", response.statusText);
    console.log("[DEBUG] - OK:", response.ok);
    console.log("[DEBUG] - Headers:", Object.fromEntries(response.headers.entries()));

    // Baca response sebagai text dulu
    const responseText = await response.text();
    console.log("[DEBUG] Response body (raw):", responseText);

    // Cek apakah response OK
    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMsg = errorData.error || errorMsg;
        console.error("[ERROR] Backend error data:", errorData);
      } catch (parseErr) {
        console.error("[ERROR] Could not parse error response as JSON");
        console.error("[ERROR] Raw response:", responseText);
      }
      
      throw new Error(errorMsg);
    }

    // Parse response JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("[DEBUG] Parsed response data:", data);
    } catch (parseErr) {
      console.error("[ERROR] Failed to parse success response as JSON");
      console.error("[ERROR] Raw response:", responseText);
      throw new Error("Invalid JSON response from server");
    }

    // Validasi structure response
    if (!data || typeof data !== 'object') {
      console.error("[ERROR] Response is not an object:", data);
      throw new Error("Invalid response structure");
    }

    if (!Array.isArray(data.results)) {
      console.error("[ERROR] Response.results is not an array:", data.results);
      return [];
    }

    console.log("[DEBUG] ✓ Search successful!");
    console.log("[DEBUG] ✓ Found", data.results.length, "books");
    console.log("[DEBUG] ===== SEARCH BY CONTENT END =====");

    return data.results;

  } catch (error) {
    console.error("[ERROR] ===== SEARCH BY CONTENT FAILED =====");
    console.error("[ERROR] Error type:", error.name);
    console.error("[ERROR] Error message:", error.message);
    console.error("[ERROR] Error stack:", error.stack);
    console.error("[ERROR] ==========================================");
    throw error;
  }
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