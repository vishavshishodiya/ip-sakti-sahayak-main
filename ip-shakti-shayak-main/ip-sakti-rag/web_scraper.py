import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import time
import json
from pathlib import Path
import logging
from urllib.parse import urljoin, urlparse
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WebScraper:
    """Web scraper for collecting Ayurveda and IP-related content"""

    def __init__(self, output_dir: str = "./scraped_data"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }

        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def scrape_url(self, url: str, max_retries: int = 3) -> Optional[Dict]:
        """Scrape content from a URL"""
        for attempt in range(max_retries):
            try:
                logger.info(f"Scraping: {url}")
                response = self.session.get(url, timeout=30)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Extract text content
                # Remove script and style elements
                for script in soup(["script", "style", "nav", "footer", "header"]):
                    script.decompose()

                # Get text
                text = soup.get_text(separator='\n', strip=True)

                # Clean up text
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                clean_text = '\n'.join(lines)

                # Extract title
                title = soup.find('title')
                title_text = title.string if title else urlparse(url).path

                return {
                    'url': url,
                    'title': title_text,
                    'content': clean_text,
                    'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
                }

            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed for {url}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    return None

    def scrape_tkdl_public_content(self) -> List[Dict]:
        """
        Scrape publicly available TKDL-related content
        Note: TKDL database itself requires special access
        """
        documents = []

        # Public information sources about TKDL
        sources = [
            {
                'url': 'https://en.wikipedia.org/wiki/Traditional_Knowledge_Digital_Library',
                'category': 'TKDL Overview'
            },
            {
                'url': 'https://www.wipo.int/tk/en/databases/tkdl/',
                'category': 'WIPO TKDL Info'
            }
        ]

        for source in sources:
            doc = self.scrape_url(source['url'])
            if doc:
                doc['category'] = source['category']
                documents.append(doc)
                self.save_document(doc)
                time.sleep(2)  # Be respectful

        return documents

    def scrape_ayush_guidelines(self) -> List[Dict]:
        """Scrape AYUSH ministry public guidelines"""
        documents = []

        # AYUSH public resources
        ayush_sources = [
            'https://ayush.gov.in/',
            'https://www.nhp.gov.in/ayurveda_mtl'
        ]

        for url in ayush_sources:
            doc = self.scrape_url(url)
            if doc:
                doc['category'] = 'AYUSH Guidelines'
                documents.append(doc)
                self.save_document(doc)
                time.sleep(2)

        return documents

    def scrape_patent_information(self) -> List[Dict]:
        """Scrape patent-related public information"""
        documents = []

        # Public patent information sources
        patent_sources = [
            {
                'url': 'https://ipindia.gov.in/ayurveda-patents.htm',
                'category': 'Indian Patents'
            }
        ]

        for source in patent_sources:
            doc = self.scrape_url(source['url'])
            if doc:
                doc['category'] = source['category']
                documents.append(doc)
                self.save_document(doc)
                time.sleep(2)

        return documents

    def save_document(self, doc: Dict):
        """Save scraped document to JSON"""
        if not doc:
            return

        # Create filename from URL
        filename = re.sub(r'[^\w\-_]', '_', doc['url'])[:100] + '.json'
        filepath = self.output_dir / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)

        logger.info(f"Saved: {filepath}")

    def load_scraped_documents(self) -> List[Dict]:
        """Load all scraped documents"""
        documents = []

        for json_file in self.output_dir.glob('*.json'):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    doc = json.load(f)
                    documents.append(doc)
            except Exception as e:
                logger.error(f"Error loading {json_file}: {str(e)}")

        return documents


class PDFScraper:
    """Scraper for PDF documents (AYUSH reports, guidelines)"""

    def __init__(self, output_dir: str = "./scraped_data/pdfs"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def download_pdf(self, url: str, filename: Optional[str] = None) -> Optional[Path]:
        """Download PDF from URL"""
        try:
            response = requests.get(url, timeout=60)
            response.raise_for_status()

            if not filename:
                filename = url.split('/')[-1]

            filepath = self.output_dir / filename

            with open(filepath, 'wb') as f:
                f.write(response.content)

            logger.info(f"Downloaded PDF: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Failed to download {url}: {str(e)}")
            return None

    def extract_text_from_pdf(self, pdf_path: Path) -> Optional[str]:
        """Extract text from PDF (requires PyPDF2 or pdfplumber)"""
        # This would require additional libraries
        # For now, returning placeholder
        logger.warning("PDF extraction requires PyPDF2 or pdfplumber")
        return None


def scrape_sample_ayurveda_content() -> List[Dict]:
    """
    Scrape sample Ayurveda and IP content from public sources
    This is a starting point - you can expand with more sources
    """
    scraper = WebScraper()

    all_documents = []

    logger.info("Starting web scraping...")

    # Scrape TKDL public info
    logger.info("Scraping TKDL public content...")
    tkdl_docs = scraper.scrape_tkdl_public_content()
    all_documents.extend(tkdl_docs)

    # Scrape AYUSH guidelines
    logger.info("Scraping AYUSH guidelines...")
    ayush_docs = scraper.scrape_ayush_guidelines()
    all_documents.extend(ayush_docs)

    # Scrape patent info
    logger.info("Scraping patent information...")
    patent_docs = scraper.scrape_patent_information()
    all_documents.extend(patent_docs)

    logger.info(f"Total documents scraped: {len(all_documents)}")

    return all_documents


if __name__ == "__main__":
    # Test the scraper
    documents = scrape_sample_ayurveda_content()
    print(f"\nScraped {len(documents)} documents")

    for doc in documents:
        print(f"- {doc['title']} ({doc['category']})")
