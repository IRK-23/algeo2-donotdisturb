# # ---- build stage ----
# FROM node:18-alpine AS build
# WORKDIR /app

# # ensure dev dependencies installed
# ENV NODE_ENV=development

# # copy package files
# COPY package.json package-lock.json* ./

# # install all dependencies (including dev deps like vite)
# RUN npm install --silent

# # copy source
# COPY . .

# # build React + Vite
# RUN npm run build

# # ---- serve stage ----
# FROM nginx:stable-alpine

# RUN rm -rf /usr/share/nginx/html/*

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /app

# Set environment untuk development build
ENV NODE_ENV=development

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (termasuk devDependencies seperti vite)
RUN npm ci --silent

# Copy source code
COPY . .

# Build aplikasi React + Vite
RUN npm run build

# ---- Serve Stage ----
FROM nginx:stable-alpine

# Hapus default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]