#!/usr/bin/env python3
"""Safely replace the IP-SAKTI FAISS knowledge base with a plain-text source."""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable

from rag_engine import RAGEngine


DEFAULT_SOURCE = Path(r"C:\Users\Anshul Yadav\Downloads\ip shakti shayak\database final.txt")
PROJECT_DIR = Path(__file__).resolve().parent


def sections_from_text(text: str) -> Iterable[tuple[str, str]]:
    """Yield named sections, keeping headings with the content they introduce."""
    heading = re.compile(r"(?m)^(?:\s*#{1,6}\s+.+|\s*(?:CHAPTER|APPENDIX)\b.*|\s*\d+(?:\.\d+){0,4}\.?\s*[-–:].+)$")
    matches = list(heading.finditer(text))
    if not matches:
        yield "Database final", text
        return

    if matches[0].start() > 0:
        preface = text[:matches[0].start()].strip()
        if preface:
            yield "Database final — Preface", preface
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        title = re.sub(r"\s+", " ", match.group().lstrip("# ").strip())[:180]
        body = text[match.start():end].strip()
        if body:
            yield title or f"Section {index + 1}", body


def chunk_words(text: str, size: int = 450, overlap: int = 60) -> Iterable[str]:
    words = text.split()
    step = max(1, size - overlap)
    for start in range(0, len(words), step):
        chunk = " ".join(words[start:start + size]).strip()
        if chunk:
            yield chunk
        if start + size >= len(words):
            break


def build_chunks(source: Path) -> list[dict]:
    text = source.read_text(encoding="utf-8", errors="replace")
    chunks: list[dict] = []
    for section_number, (section, content) in enumerate(sections_from_text(text), start=1):
        for chunk_number, chunk in enumerate(chunk_words(content), start=1):
            chunks.append({
                "text": chunk,
                "metadata": {
                    "source": source.name,
                    "source_type": "plain_text",
                    "knowledge_base": "database final",
                    "section": section,
                    "section_number": section_number,
                    "chunk_number": chunk_number,
                    "ingested_at": datetime.now().isoformat(timespec="seconds"),
                },
            })
    return chunks


def backup_database() -> Path | None:
    data_dir = PROJECT_DIR / "faiss_data"
    if not data_dir.exists():
        return None
    backup_root = PROJECT_DIR / "faiss_data_backups"
    backup_root.mkdir(exist_ok=True)
    backup = backup_root / f"faiss_backup_before_database_final_{datetime.now():%Y%m%d_%H%M%S}"
    shutil.copytree(data_dir, backup)
    return backup


def main() -> int:
    parser = argparse.ArgumentParser(description="Replace the RAG database with a plain-text knowledge source.")
    parser.add_argument("--file", type=Path, default=DEFAULT_SOURCE, help="Plain-text source file.")
    parser.add_argument("--batch-size", type=int, default=48, help="Embedding batch size.")
    parser.add_argument("--skip-confirm", action="store_true", help="Do not prompt before rebuilding.")
    args = parser.parse_args()

    source = args.file.expanduser().resolve()
    if not source.is_file():
        print(f"Source file not found: {source}", file=sys.stderr)
        return 2
    if source.suffix.lower() not in {".txt", ".md"}:
        print("Only .txt and .md sources are supported.", file=sys.stderr)
        return 2

    chunks = build_chunks(source)
    if not chunks:
        print("The source did not produce any indexable text.", file=sys.stderr)
        return 2
    print(f"Source: {source.name}\nPrepared {len(chunks):,} searchable chunks.")
    if not args.skip_confirm:
        answer = input("Back up and replace the current FAISS database? [y/N]: ").strip().lower()
        if answer not in {"y", "yes"}:
            print("No changes made.")
            return 0

    backup = backup_database()
    if backup:
        print(f"Backup created: {backup}")

    rag = RAGEngine()
    rag.vector_store.clear_collection()
    for start in range(0, len(chunks), args.batch_size):
        batch = chunks[start:start + args.batch_size]
        rag.vector_store.add_documents(batch)
        print(f"Indexed {min(start + len(batch), len(chunks)):,}/{len(chunks):,} chunks", end="\r", flush=True)
    print()
    stats = rag.get_stats()
    print(f"Replacement complete. Indexed documents: {stats.get('document_count', 0):,}")
    print(f"Embedding model: {stats.get('embedding_model', 'unknown')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
