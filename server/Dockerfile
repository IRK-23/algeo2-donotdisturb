# # ---- build stage (install deps) ----
# FROM python:3.10-slim AS builder

# ENV DEBIAN_FRONTEND=noninteractive

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential gcc libffi-dev git curl \
#  && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# COPY requirements.txt .

# RUN python -m pip install --upgrade pip setuptools wheel \
#  && pip install --no-cache-dir -r requirements.txt

# # ---- runtime stage ----
# FROM python:3.10-slim

# ENV PYTHONUNBUFFERED=1
# ENV PORT=5000

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     ca-certificates \
#  && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # copy python libs
# COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# # copy bin (contains gunicorn)
# COPY --from=builder /usr/local/bin /usr/local/bin

# # copy app
# COPY . .

# RUN mkdir -p /app/data/query

# EXPOSE 5000

# ENV GUNICORN_WORKERS=3
# CMD ["sh", "-c", "gunicorn -w ${GUNICORN_WORKERS} -k gthread -b 0.0.0.0:${PORT} --access-logfile - --error-logfile - app:app"]
# ----------------------------------------------------------------------------------------------------------------------------------------------



#     # ---- build stage (install deps) ----
# FROM python:3.10-slim AS builder

# ENV DEBIAN_FRONTEND=noninteractive

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential gcc libffi-dev git curl \
#  && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# COPY requirements.txt .

# RUN python -m pip install --upgrade pip setuptools wheel \
#  && pip install --no-cache-dir -r requirements.txt

# # ---- runtime stage ----
# FROM python:3.10-slim

# ENV PYTHONUNBUFFERED=1
# ENV PORT=5000

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     ca-certificates \
#  && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # copy python libs
# COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# # copy bin (contains gunicorn)
# COPY --from=builder /usr/local/bin /usr/local/bin

# # copy app (IMPORTANT)
# COPY . .

# # copy model/data folders explicitly
# COPY data ./data
# COPY models ./models

# # create required directories
# RUN mkdir -p /data/query \
#     && chmod -R 755 /data

# EXPOSE 5000

# ENV GUNICORN_WORKERS=3
# CMD ["gunicorn", "-w", "3", "-k", "gthread", "-b", "0.0.0.0:5000", "--access-logfile", "-", "--error-logfile", "-", "app:app"]


# ---- Build Stage ----
FROM python:3.10-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    git \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt

# ---- Runtime Stage ----
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PORT=5000

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python libraries dari builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# Copy binaries (gunicorn, dll)
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy aplikasi
COPY . .

# Buat direktori yang diperlukan
RUN mkdir -p /app/data/query \
 && mkdir -p /app/data/covers \
 && mkdir -p /app/data/txt \
 && mkdir -p /app/model/pca_model_test

EXPOSE 5000

# Set default workers
ENV GUNICORN_WORKERS=3

# Start dengan gunicorn
CMD ["sh", "-c", "gunicorn -w ${GUNICORN_WORKERS} -k gthread --threads 2 -b 0.0.0.0:${PORT} --timeout 120 --access-logfile - --error-logfile - app:app"]