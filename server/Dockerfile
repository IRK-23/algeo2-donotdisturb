# ---- build stage (install deps) ----
FROM python:3.10-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libffi-dev git curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt

# ---- runtime stage ----
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PORT=5000

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy python libs
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# copy bin (contains gunicorn)
COPY --from=builder /usr/local/bin /usr/local/bin

# copy app
COPY . .

RUN mkdir -p /app/data/query

EXPOSE 5000

ENV GUNICORN_WORKERS=3
CMD ["sh", "-c", "gunicorn -w ${GUNICORN_WORKERS} -k gthread -b 0.0.0.0:${PORT} --access-logfile - --error-logfile - app:app"]