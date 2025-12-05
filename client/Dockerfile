# ===== Stage 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

# Jangan pakai NODE_ENV global (akan memengaruhi langkah build berikutnya)
# ENV NODE_ENV=development  <-- HAPUS INI

RUN apk add --no-cache python3 make g++

COPY package.json .
COPY package-lock.json .

# Install semua termasuk dev deps
RUN npm install --include=dev

COPY . .

# Paksa environment development *hanya* saat build
ENV NODE_ENV=development
RUN npx vite build

# ===== Stage 2: Serve =====
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
