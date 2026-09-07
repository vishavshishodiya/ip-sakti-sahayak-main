import re
from typing import List, Dict
from pathlib import Path


class MarkdownProcessor:
    """Process markdown documents for RAG ingestion"""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def load_document(self, file_path: str) -> str:
        """Load markdown document from file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()

    def parse_slides(self, content: str) -> List[Dict[str, str]]:
        """Parse markdown into slide-based chunks"""
        # Split by slide separator
        slides = re.split(r'\n---\n', content)

        parsed_slides = []
        for idx, slide in enumerate(slides):
            slide = slide.strip()
            if not slide:
                continue

            # Extract title (first line that's a heading)
            title_match = re.search(r'^##?\s+(.+)$', slide, re.MULTILINE)
            title = title_match.group(1) if title_match else f"Section {idx + 1}"

            parsed_slides.append({
                "title": title,
                "content": slide,
                "slide_number": idx + 1,
                "source": "IP_SAKTI_Sahayak_Presentation.md"
            })

        return parsed_slides

    def chunk_text(self, text: str, metadata: Dict) -> List[Dict]:
        """Split text into smaller chunks with overlap"""
        words = text.split()
        chunks = []

        for i in range(0, len(words), self.chunk_size - self.chunk_overlap):
            chunk_words = words[i:i + self.chunk_size]
            chunk_text = ' '.join(chunk_words)

            chunks.append({
                "text": chunk_text,
                "metadata": {
                    **metadata,
                    "chunk_index": len(chunks)
                }
            })

            if i + self.chunk_size >= len(words):
                break

        return chunks

    def process_document(self, file_path: str) -> List[Dict]:
        """Main processing pipeline"""
        content = self.load_document(file_path)
        slides = self.parse_slides(content)

        all_chunks = []
        for slide in slides:
            # Each slide is already a good chunk size
            # But we'll split large slides if needed
            if len(slide['content'].split()) > self.chunk_size:
                chunks = self.chunk_text(
                    slide['content'],
                    {
                        "title": slide['title'],
                        "slide_number": slide['slide_number'],
                        "source": slide['source']
                    }
                )
                all_chunks.extend(chunks)
            else:
                all_chunks.append({
                    "text": slide['content'],
                    "metadata": {
                        "title": slide['title'],
                        "slide_number": slide['slide_number'],
                        "source": slide['source'],
                        "chunk_index": 0
                    }
                })

        return all_chunks


def extract_key_topics(content: str) -> List[str]:
    """Extract key topics from document for better retrieval"""
    topics = []

    # Extract headings
    headings = re.findall(r'^##?\s+(.+)$', content, re.MULTILINE)
    topics.extend(headings)

    # Extract important terms (capitalized phrases)
    terms = re.findall(r'\b[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*\b', content)
    topics.extend(set(terms))

    return topics
