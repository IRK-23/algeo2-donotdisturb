import os
import re
import json
from pathlib import Path
from typing import List, Tuple, Dict, Any
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# PATH
DATA_DIR = Path("C:/Users/atias/OneDrive/Documents/algeo2-donotdisturb/data/txt")  
OUTPUT_PATH = Path("C:/Users/atias/OneDrive/Documents/algeo2-donotdisturb/src/backend/lib/LSA/csv/preprocessed.json")

# LOAD DOCUMMENTS
# baca semua .txt dari data_dir
# raw_documents: list string isi dokumen
# file_paths: list string path file dokumen
def load_raw_documents(data_dir: Path) -> Tuple[List[str], List[str]]:
    raw_documents: List[str] = []
    file_paths: List[str] = []

    for filename in sorted(os.listdir(data_dir)):
        if not filename.lower().endswith(".txt"):
            continue

        file_path = data_dir / filename
        file_paths.append(str(file_path))

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
            raw_documents.append(text)

    return raw_documents, file_paths

# TOKENISASI
# mengubah string menjadi list token
def tokenize(text: str) -> List[str]:
    return re.findall(r"\b\w+\b", text)

# NORMALISASI
# lowercase dan hanya ambil token huruf
def normalize_tokens(tokens: List[str]) -> List[str]:
    normalized: List[str] = []
    for t in tokens:
        t_low = t.lower()
        if t_low.isalpha():
            normalized.append(t_low)
    return normalized

# STEMMING
stemmer = PorterStemmer()
def stem_tokens(tokens: List[str]) -> List[str]:
    return [stemmer.stem(t) for t in tokens]

# STOPWORD REMOVAL
nltk.download("stopwords", quiet=True)
STOPWORDS = set(stopwords.words("english"))

def remove_stopwords(tokens: List[str]) -> List[str]:
    return [t for t in tokens if t not in STOPWORDS]

# PREPROCESSING PIPELINE
def preprocessing(raw_documents: List[str]) -> List[List[str]]:
    tokenized_docs = [tokenize(doc) for doc in raw_documents]
    normalized_docs = [normalize_tokens(tokens) for tokens in tokenized_docs]
    stemmed_docs = [stem_tokens(tokens) for tokens in normalized_docs]
    clean_docs = [remove_stopwords(tokens) for tokens in stemmed_docs]
    return clean_docs

# SIMPAN JSON
def save_preprocessed(
    file_paths: List[str],
    clean_docs: List[List[str]],
    output_path: Path
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    data = []
    for path, tokens in zip(file_paths, clean_docs):
        data.append({
            "path": path,
            "tokens": tokens,
        })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)

# MAIN FUNCTION
def main():
    raw_docs, file_paths = load_raw_documents(DATA_DIR)
    clean_docs = preprocessing(raw_docs)
    save_preprocessed(file_paths, clean_docs, OUTPUT_PATH)

if __name__ == "__main__":
    main()


# CEK JSON
# def load_preprocessed_json(path: Path) -> List[Dict[str, Any]]:
#     """
#     Membaca file JSON hasil preprocessing dan mengembalikan list dokumen.
#     Setiap elemen adalah dict dengan key: 'path' dan 'tokens'.
#     """
#     with open(path, "r", encoding="utf-8") as f:
#         data = json.load(f)
#     return data


# def print_sample_docs(
#     data: List[Dict[str, Any]],
#     n_docs: int = 5,
#     n_tokens: int = 30
# ) -> None:
#     """
#     Print beberapa dokumen contoh dari data preprocessed.
#     - n_docs: berapa dokumen yang mau ditampilkan
#     - n_tokens: berapa token pertama yang mau ditampilkan per dokumen
#     """
#     total = len(data)
#     print(f"Total dokumen di JSON: {total}")

#     for i, doc in enumerate(data[:n_docs]):
#         path = doc.get("path", "<no-path>")
#         tokens = doc.get("tokens", [])

#         print("\n============================")
#         print(f"Dokumen {i}")
#         print(f"Path        : {path}")
#         print(f"Jumlah token: {len(tokens)}")
#         print("Token awal  :", " ".join(tokens[:n_tokens]))

# JSON_PATH = Path("./src/backend/lib/LSA/csv/preprocessed.json")

# if __name__ == "__main__":
#     data = load_preprocessed_json(OUTPUT_PATH)
#     print_sample_docs(data, n_docs=5, n_tokens=40)

