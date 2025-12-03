# ---- build stage ----
FROM node:18-alpine AS build
WORKDIR /app

# ensure dev dependencies installed
ENV NODE_ENV=development

# copy package files
COPY package.json package-lock.json* ./

# install all dependencies (including dev deps like vite)
RUN npm install --silent

# copy source
COPY . .

# build React + Vite
RUN npm run build

# ---- serve stage ----
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
