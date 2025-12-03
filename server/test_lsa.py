# src/backend/lib/LSA/code/lsa_driver.py

from pathlib import Path
from typing import List, Tuple

from lib.LSA.code.lsa_search import (
    load_doc_embeddings,
    compute_query_embedding,
    search_similar_documents,
)


def print_menu():
    print("====================================")
    print("        LSA SEARCH DEMO             ")
    print("====================================")
    print("1. Search by document (input file .txt)")
    print("2. Recommendation (based on document index)")
    print("0. Exit")
    print("====================================")


def ask_doc_index(num_docs: int, doc_paths: List[str]) -> int:
    """
    Minta input index dokumen dari user.
    Hanya dipakai untuk mode REKOMENDASI.
    """
    print(f"\nTotal dokumen: {num_docs}")
    print("Contoh beberapa dokumen pertama:")
    for i in range(min(5, num_docs)):
        print(f"  {i}: {Path(doc_paths[i]).name}")

    while True:
        raw = input(f"\nMasukkan index dokumen [0..{num_docs-1}]: ").strip()
        try:
            idx = int(raw)
            if 0 <= idx < num_docs:
                return idx
            else:
                print("Index di luar jangkauan, coba lagi.")
        except ValueError:
            print("Input harus berupa bilangan bulat, coba lagi.")


def ask_file_path() -> Path:
    """
    Minta path file .txt dari user untuk mode
    'Search by document' (dokumen eksternal).
    """
    while True:
        raw = input("\nMasukkan path file dokumen (.txt): ").strip()
        if not raw:
            print("Path kosong, coba lagi.")
            continue

        p = Path(raw)
        if not p.is_file():
            print(f"File tidak ditemukan: {p}. Coba lagi.")
            continue

        # opsional: cek ekstensi
        if p.suffix.lower() != ".txt":
            print("Peringatan: file bukan .txt, tetap lanjut (y/n)?")
            ans = input("> ").strip().lower()
            if ans not in ("y", "ya", "yes"):
                continue
        return p

def print_results(
    results: List[Tuple[int, float, str]],
    title: str,
):
    print("\n====================================")
    print(title)
    print("====================================")
    if not results:
        print("Tidak ada hasil.")
        return
    for rank, (idx, score, path) in enumerate(results, start=1):
        print(f"{rank}. idx={idx:5d} | sim={score: .6f} | {Path(path).name}")
    print()

def main():
    # Load embedding dokumen 
    D_norm, doc_paths = load_doc_embeddings()
    num_docs, k = D_norm.shape
    print(f"Loaded {num_docs} documents with embedding dim = {k}\n")

    TOP_K = 5  # jumlah dokumen yang akan ditampilkan

    while True:
        print_menu()
        choice = input("Pilihan Anda: ").strip()

        if choice == "0":
            print("Keluar.")
            break

        elif choice == "1":
            # MODE 1: SEARCH BY DOCUMENT (INPUT FILE)
            print("\n=== SEARCH BY DOCUMENT (FILE) ===")
            file_path = ask_file_path()

            # Baca isi file sebagai teks
            try:
                text = file_path.read_text(encoding="utf-8", errors="ignore")
            except Exception as e:
                print(f"Gagal membaca file: {e}")
                continue

            if not text.strip():
                print("File kosong atau hanya berisi whitespace, coba file lain.\n")
                continue

            # 1) compute_query_embedding -> dq_norm
            dq_norm = compute_query_embedding(text)

            # 2) search_similar_documents (tidak perlu remove_self)
            results = search_similar_documents(
                dq_norm=dq_norm,
                D_norm=D_norm,
                doc_paths=doc_paths,
                top_k=TOP_K,
                remove_self=False,
                self_index=None,
            )
            title = f"Hasil SEARCH BY DOCUMENT untuk file: {file_path.name}"
            print_results(results, title)

        elif choice == "2":
            # MODE 2: RECOMMENDATION BY DOCUMENT INDEX (KORPUS)
            print("\n=== RECOMMENDATION (BY DOCUMENT INDEX) ===")
            doc_idx = ask_doc_index(num_docs, doc_paths)

            # Embedding "query" diambil dari dokumen itu sendiri (sudah di D_norm)
            dq_norm = D_norm[doc_idx]

            # Untuk rekomendasi, kita buang dirinya sendiri (cosine=1)
            results = search_similar_documents(
                dq_norm=dq_norm,
                D_norm=D_norm,
                doc_paths=doc_paths,
                top_k=TOP_K,
                remove_self=True,
                self_index=doc_idx,
            )
            title = (
                f"Hasil RECOMMENDATION untuk dokumen idx={doc_idx} "
                f"({Path(doc_paths[doc_idx]).name})"
            )
            print_results(results, title)
        else:
            print("Pilihan tidak dikenal, silakan pilih 0 / 1 / 2.\n")


if __name__ == "__main__":
    main()
