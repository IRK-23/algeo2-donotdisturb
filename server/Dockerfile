FROM python:3.10-slim

WORKDIR /app

# Install dependency
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
