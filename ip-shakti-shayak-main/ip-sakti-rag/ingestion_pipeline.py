"""
Advanced Document Ingestion System
Handles multiple document formats: Web pages, PDFs, Text files, JSON
"""
from typing import List, Dict, Optional
import json
from pathlib import Path
import logging
from document_processor import MarkdownProcessor
from web_scraper import WebScraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DocumentIngestionPipeline:
    """
    Production-grade document ingestion pipeline
    Handles various sources and formats
    """

    def __init__(self, rag_engine):
        self.rag_engine = rag_engine
        self.processor = MarkdownProcessor()
        self.web_scraper = WebScraper()
        self.stats = {
            'total_documents': 0,
            'total_chunks': 0,
            'sources': {}
        }

    def ingest_directory(self, directory: str, pattern: str = "*.md") -> Dict:
        """Ingest all matching files from a directory"""
        dir_path = Path(directory)

        if not dir_path.exists():
            raise FileNotFoundError(f"Directory not found: {directory}")

        files = list(dir_path.glob(pattern))
        logger.info(f"Found {len(files)} files matching {pattern}")

        total_chunks = 0

        for file_path in files:
            try:
                logger.info(f"Processing: {file_path}")
                result = self.rag_engine.ingest_document(str(file_path))
                total_chunks += result['chunks_added']

                self.stats['total_documents'] += 1
                self.stats['sources'][str(file_path)] = result['chunks_added']

            except Exception as e:
                logger.error(f"Failed to process {file_path}: {str(e)}")

        self.stats['total_chunks'] = total_chunks

        return {
            'status': 'success',
            'files_processed': len(files),
            'total_chunks': total_chunks
        }

    def ingest_web_content(self, urls: List[str]) -> Dict:
        """Scrape and ingest content from URLs"""
        total_chunks = 0

        for url in urls:
            try:
                # Scrape the URL
                doc = self.web_scraper.scrape_url(url)

                if not doc:
                    logger.warning(f"Failed to scrape: {url}")
                    continue

                # Convert to chunks
                chunks = self._web_doc_to_chunks(doc)

                # Add to vector store
                num_added = self.rag_engine.vector_store.add_documents(chunks)
                total_chunks += num_added

                self.stats['total_documents'] += 1
                self.stats['sources'][url] = num_added

                logger.info(f"Ingested {num_added} chunks from {url}")

            except Exception as e:
                logger.error(f"Failed to ingest {url}: {str(e)}")

        self.stats['total_chunks'] += total_chunks

        return {
            'status': 'success',
            'urls_processed': len(urls),
            'total_chunks': total_chunks
        }

    def ingest_json_data(self, json_path: str) -> Dict:
        """Ingest structured data from JSON file"""
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Handle different JSON structures
        if isinstance(data, list):
            documents = data
        elif isinstance(data, dict) and 'documents' in data:
            documents = data['documents']
        else:
            documents = [data]

        chunks = []
        for doc in documents:
            chunk = self._json_to_chunk(doc)
            if chunk:
                chunks.append(chunk)

        num_added = self.rag_engine.vector_store.add_documents(chunks)

        self.stats['total_documents'] += len(documents)
        self.stats['total_chunks'] += num_added
        self.stats['sources'][json_path] = num_added

        return {
            'status': 'success',
            'documents_processed': len(documents),
            'chunks_added': num_added
        }

    def ingest_scraped_data(self, scraped_dir: str = "./scraped_data") -> Dict:
        """Ingest all previously scraped web content"""
        scraper = WebScraper(output_dir=scraped_dir)
        documents = scraper.load_scraped_documents()

        logger.info(f"Loading {len(documents)} scraped documents")

        chunks = []
        for doc in documents:
            doc_chunks = self._web_doc_to_chunks(doc)
            chunks.extend(doc_chunks)

        num_added = self.rag_engine.vector_store.add_documents(chunks)

        self.stats['total_documents'] += len(documents)
        self.stats['total_chunks'] += num_added

        return {
            'status': 'success',
            'documents_processed': len(documents),
            'chunks_added': num_added
        }

    def _web_doc_to_chunks(self, doc: Dict) -> List[Dict]:
        """Convert scraped web document to chunks"""
        content = doc.get('content', '')

        # Split content into paragraphs
        paragraphs = content.split('\n\n')

        chunks = []
        for i, para in enumerate(paragraphs):
            if len(para.strip()) < 50:  # Skip very short paragraphs
                continue

            # Create chunk with max 500 words
            words = para.split()
            for j in range(0, len(words), 500):
                chunk_text = ' '.join(words[j:j+500])

                chunks.append({
                    'text': chunk_text,
                    'metadata': {
                        'title': doc.get('title', 'Unknown'),
                        'source': doc.get('url', 'Unknown'),
                        'category': doc.get('category', 'Web Content'),
                        'scraped_at': doc.get('scraped_at', 'Unknown'),
                        'chunk_index': len(chunks)
                    }
                })

        return chunks

    def _json_to_chunk(self, doc: Dict) -> Optional[Dict]:
        """Convert JSON document to chunk"""
        # Extract text from various possible fields
        text = doc.get('text') or doc.get('content') or doc.get('description')

        if not text:
            return None

        return {
            'text': text,
            'metadata': {
                'title': doc.get('title', 'Unknown'),
                'source': doc.get('source', 'JSON Data'),
                'category': doc.get('category', 'Structured Data'),
                'chunk_index': 0
            }
        }

    def get_stats(self) -> Dict:
        """Get ingestion statistics"""
        return self.stats

    def create_knowledge_base(self) -> Dict:
        """
        Create a complete knowledge base from multiple sources
        This is the main method to build your production database
        """
        logger.info("Building knowledge base...")

        results = {
            'markdown_docs': None,
            'web_content': None,
            'scraped_data': None
        }

        # 1. Ingest presentation and other markdown docs
        try:
            doc_path = r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md"
            result = self.rag_engine.ingest_document(doc_path)
            results['markdown_docs'] = result
            logger.info(f"Markdown docs: {result['chunks_added']} chunks")
        except Exception as e:
            logger.error(f"Markdown ingestion failed: {str(e)}")

        # 2. Ingest previously scraped web content
        try:
            result = self.ingest_scraped_data()
            results['scraped_data'] = result
            logger.info(f"Scraped data: {result['chunks_added']} chunks")
        except Exception as e:
            logger.error(f"Scraped data ingestion failed: {str(e)}")

        # Get final stats
        final_stats = self.rag_engine.get_stats()

        return {
            'status': 'success',
            'total_documents': final_stats['document_count'],
            'results': results,
            'statistics': self.stats
        }


def build_production_knowledge_base(rag_engine):
    """
    Main function to build production knowledge base
    """
    pipeline = DocumentIngestionPipeline(rag_engine)

    logger.info("="*60)
    logger.info("BUILDING PRODUCTION KNOWLEDGE BASE")
    logger.info("="*60)

    result = pipeline.create_knowledge_base()

    logger.info("\n" + "="*60)
    logger.info("KNOWLEDGE BASE BUILD COMPLETE")
    logger.info("="*60)
    logger.info(f"Total documents in database: {result['total_documents']}")

    return result


if __name__ == "__main__":
    from rag_engine import RAGEngine

    rag = RAGEngine()
    build_production_knowledge_base(rag)
