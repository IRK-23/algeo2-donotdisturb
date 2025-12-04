[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/WQhgEYKW)

# Tugas Besar 2 Aljabar Linier dan Geometri

# Anggota Kelompok "Do Not Disturb"
1. Agatha Tatianingseto (13524008) 
2. Keisha Rizka Syofyani (1352407)
3. Reynard Anderson Wijaya (13524111)

## Struktur Folder Proyek
```bash
root
├───client/             # Kode sumber Frontend (React JS)
│   └───src/            # Kode React JS
│   └───package.json    # Dependencies Frontend (Node.js/NPM)
│
├───server/             # Kode Sumber Backend (Flask/Python)
│   ├───data/           # Data mentah, mapper.json, file sementara (covers, txt)
│   ├───lib/            # Kode sumber custom library (LSA code, PCA code)
│   └───model/          # Folder untuk menyimpan model PCA/LSA hasil training
│   └───requirements.txt # Dependencies Python
│
├───client/dist/        # Hasil kompilasi/build Frontend (Generated)
├───.gitignore          # Daftar file yang diabaikan Git
├───docker-compose.yml  # Konfigurasi orkestrasi multi-kontainer Docker
├───README.md
└───LICENSE
```


## Tujuan Setiap Direktori

| Direktori           | Tujuan                        | Keterangan |
|--------------------|-------------------------------|------------|
| `client/`          | Frontend (React)              | Berisi kode sumber antarmuka pengguna. |
| `server/`          | Backend (Python/Flask)        | Berisi kode sumber API dan server logic. |
| `client/dist/`     | Build Assets                  | Output dari `npm run build` yang berisi HTML, CSS, dan JS siap production. |
| `server/data/`     | Data Mentah                   | Menyimpan `mapper.json`, file teks (`txt/`), gambar sampul (`covers/`), dan folder kueri sementara (`query/`). |
| `server/lib/`      | Library Inti                 | Modul Python yang berisi logika LSA dan PCA. |
| `server/model/`    | Model Vektor                  | Menyimpan embedding atau model hasil training (misal PCA). |
| `docker-compose.yml` | Orkestrasi                  | Menjalankan frontend dan backend sekaligus menggunakan Docker. |

## Deskripsi Alur Sistem

Sistem ini melakukan pencarian dan rekomendasi buku berdasarkan pemrosesan data di backend (Flask/Python).

### **1. Inisialisasi (Startup)**
- Sistem memuat dataset
- Menjalankan pra-pemrosesan teks
- Membentuk Matriks Term-Document

### **2. Reduksi Dimensi & Embedding**
- PCA untuk gambar
- SVD/LSA untuk teks  
- Embedding disimpan sebagai vektor

### **3. Caching Rekomendasi**
Matriks kesamaan LSA antar dokumen dihitung **sekali saja** saat server startup dan disimpan dalam cache memori (`RECS_CACHE`) agar rekomendasi instan.

### **4. Pengguna Melakukan Kueri**
| Input | Metode | Output |
|-------|--------|--------|
| Gambar Sampul | PCA + Nearest Neighbors | Ranking buku serupa berdasarkan visual |
| Teks Dokumen | LSA + Cosine Similarity | Ranking buku serupa berdasarkan konten |
| Judul | Substring match | Daftar buku yang cocok |

### **5. Tampilan**
- Hasil rekomendasi dikembalikan dalam bentuk **JSON**
- Ditampilkan oleh frontend (React JS)

## Instalasi dan Eksekusi

Aplikasi ini dapat dijalankan secara lokal (manual) atau menggunakan Docker untuk simulasi lingkungan production.

## Prasyarat Sistem

### **Backend (Python)**
- Python 3.10+
- Pip
- Git

### **Frontend (Node.js)**
- Node.js 18+
- npm

## 1. Menjalankan Program Secara Manual (Development)

Aplikasi dijalankan menggunakan dua terminal terpisah di mode development (cepat dan hot-reloading).

### **Terminal 1: Backend (Flask)**

```bash
cd server
pip install -r requirements.txt
python app.py
```
(Server akan berjalan di http://localhost:5000)

### **Terminal 2: Frontend (React + Vite)**

```bash
cd client
npm install
npm run dev
```
(Aplikasi akan berjalan di http://localhost:5174 atau port lainnya)

Akses Browser: Buka http://localhost:5174 (atau port yang ditunjukkan oleh Terminal 2).

### 2. Menjalankan Program dengan Docker Compose (Production Simulation)
Metode ini paling menyerupai lingkungan production karena menjalankan frontend dan backend dalam kontainer terpisah yang terhubung.

# Dari root folder program (tempat docker-compose.yml berada)
docker compose -f docker-compose.yml up --build

(Proses ini akan membangun image dan menjalankan proses pre-komputasi LSA/PCA.)

Akses Browser: Buka http://localhost

## Fitur Sistem

| **Fitur**               | **Input**             | **Metode**                                  | **Output**                                 |
|-------------------------|-----------------------|---------------------------------------------|--------------------------------------------|
| **1. Pencarian Gambar** | Gambar Sampul         | PCA + Nearest Neighbors                     | Ranking buku serupa berdasarkan visual     |
| **2. Pencarian Teks**   | File `.txt`           | LSA + Cosine Similarity                     | Ranking buku serupa berdasarkan konten     |
| **3. Pencarian Judul**  | Substring Judul       | Pencarian String Langsung                   | Daftar buku yang cocok                     |
| **4. Rekomendasi Buku** | ID Buku               | Lookup dari Matriks Kesamaan LSA (Cached)   | Daftar buku rekomendasi                    |
