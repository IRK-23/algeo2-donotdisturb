# client/Dockerfile

# --- STAGE 1: BUILD APLIKASI (Menggunakan Node.js) ---
# Menggunakan image Node Alpine untuk ukuran yang kecil
FROM node:20-alpine AS builder

# Mengatur environment
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Menyalin package.json dan package-lock.json untuk caching dependency
# Ini adalah langkah yang efisien: jika dependencies tidak berubah, Docker tidak akan mengulang instalasi
COPY package.json ./
COPY package-lock.json ./

# Instal semua dependencies (dependencies dan devDependencies)
RUN npm install

# Menyalin seluruh kode sumber (termasuk folder src/frontend)
COPY . .

# Menjalankan production build (Vite akan menghasilkan folder 'dist/')
RUN npm run build


# --- STAGE 2: SERVE APLIKASI (Menggunakan Nginx) ---
# Menggunakan Nginx image yang sangat ringan untuk menyajikan file statis
FROM nginx:alpine

# Menyalin konfigurasi Nginx kustom (jika ada, untuk routing atau cache)
# Jika tidak ada, Nginx akan menyajikan dari folder /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Menyalin hasil build statis (folder dist/) dari stage 'builder'
# Folder 'dist' adalah output default dari perintah 'npm run build' di Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Port default Nginx yang akan di-expose (Port 80 di dalam container)
EXPOSE 80

# Command default untuk menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]