#!/usr/bin/env python3
"""
Production Setup Script for IP-SAKTI Sahayak RAG System
This script builds a complete knowledge base from multiple sources
"""
import sys
import time
from pathlib import Path

# Add color output for terminals that support it
try:
    from colorama import init, Fore, Style
    init()
    RED = Fore.RED
    GREEN = Fore.GREEN
    YELLOW = Fore.YELLOW
    BLUE = Fore.BLUE
    RESET = Style.RESET_ALL
except ImportError:
    RED = GREEN = YELLOW = BLUE = RESET = ""


def print_header(text):
    """Print section header"""
    print(f"\n{BLUE}{'='*70}")
    print(f"{text.center(70)}")
    print(f"{'='*70}{RESET}\n")


def print_success(text):
    """Print success message"""
    print(f"{GREEN}[OK] {text}{RESET}")


def print_error(text):
    """Print error message"""
    print(f"{RED}[ERROR] {text}{RESET}")


def print_info(text):
    """Print info message"""
    print(f"{YELLOW}[INFO] {text}{RESET}")


def setup_production_rag():
    """Main setup function"""
    print_header("IP-SAKTI SAHAYAK RAG - PRODUCTION SETUP")

    # Step 1: Import required modules
    print_info("Loading required modules...")
    try:
        from rag_engine import RAGEngine
        from web_scraper import scrape_sample_ayurveda_content
        from ingestion_pipeline import DocumentIngestionPipeline
        print_success("All modules loaded")
    except ImportError as e:
        print_error(f"Import error: {e}")
        print_info("Make sure you're in the virtual environment: .\\venv\\Scripts\\activate")
        sys.exit(1)

    # Step 2: Initialize RAG Engine
    print_info("Initializing RAG engine...")
    rag = RAGEngine()
    print_success("RAG engine initialized")

    # Check current database status
    stats = rag.get_stats()
    print_info(f"Current database: {stats['document_count']} documents")

    if stats['document_count'] > 0:
        response = input(f"\n{YELLOW}Database already contains data. Clear and rebuild? (y/N): {RESET}")
        if response.lower() == 'y':
            print_info("Clearing existing database...")
            rag.clear_database()
            print_success("Database cleared")
        else:
            print_info("Keeping existing data and adding new content")

    # Step 3: Ingest presentation document
    print_header("STEP 1: INGEST PRESENTATION DOCUMENT")

    presentation_path = r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md"

    if Path(presentation_path).exists():
        print_info(f"Processing: {presentation_path}")
        try:
            result = rag.ingest_document(presentation_path)
            print_success(f"Ingested {result['chunks_added']} chunks from presentation")
        except Exception as e:
            print_error(f"Failed: {str(e)}")
    else:
        print_error("Presentation file not found")
        print_info("Please update the path in setup_production.py")

    # Step 4: Web scraping
    print_header("STEP 2: SCRAPE WEB CONTENT")

    response = input(f"{YELLOW}Scrape public TKDL and AYUSH content? (y/N): {RESET}")
    if response.lower() == 'y':
        print_info("Starting web scraping (this may take a few minutes)...")
        try:
            documents = scrape_sample_ayurveda_content()
            print_success(f"Scraped {len(documents)} web pages")

            # Ingest scraped content
            pipeline = DocumentIngestionPipeline(rag)
            result = pipeline.ingest_scraped_data()
            print_success(f"Ingested {result['chunks_added']} chunks from web content")

        except Exception as e:
            print_error(f"Scraping failed: {str(e)}")
            print_info("Continuing with existing data...")
    else:
        print_info("Skipping web scraping")

    # Step 5: Check for additional documents
    print_header("STEP 3: INGEST ADDITIONAL DOCUMENTS")

    data_dir = Path("./data")
    if data_dir.exists():
        md_files = list(data_dir.glob("*.md"))
        if md_files:
            print_info(f"Found {len(md_files)} markdown files in ./data/")
            response = input(f"{YELLOW}Ingest all markdown files? (y/N): {RESET}")
            if response.lower() == 'y':
                pipeline = DocumentIngestionPipeline(rag)
                result = pipeline.ingest_directory("./data", "*.md")
                print_success(f"Ingested {result['total_chunks']} chunks from {result['files_processed']} files")
        else:
            print_info("No additional markdown files found in ./data/")
    else:
        print_info("No ./data/ directory found")
        print_info("You can create ./data/ and add markdown documents there")

    # Step 6: Final statistics
    print_header("SETUP COMPLETE - FINAL STATISTICS")

    final_stats = rag.get_stats()
    print(f"{GREEN}")
    print(f"  Database: {final_stats['collection_name']}")
    print(f"  Total Documents: {final_stats['document_count']}")
    print(f"  Embedding Model: {final_stats['embedding_model']}")
    print(f"{RESET}")

    # Step 7: Test queries
    print_header("RUNNING TEST QUERIES")

    test_queries = [
        "What are the project objectives?",
        "What is the team structure?",
        "What is the budget?"
    ]

    for i, query in enumerate(test_queries, 1):
        print(f"\n{BLUE}Test {i}: {query}{RESET}")
        try:
            result = rag.query(query, top_k=3)
            print(f"  Confidence: {result['confidence']:.1%}")
            print(f"  Sources: {result['num_sources']}")
            print(f"  Method: {result['method']}")
            print_success("Query successful")
        except Exception as e:
            print_error(f"Query failed: {str(e)}")

    # Step 8: Next steps
    print_header("NEXT STEPS")

    print(f"{GREEN}Your production RAG system is ready!{RESET}\n")
    print("Try these commands:")
    print(f"  {YELLOW}python cli.py interactive{RESET}     - Interactive query mode")
    print(f"  {YELLOW}python api.py{RESET}                 - Start REST API server")
    print(f"  {YELLOW}python demo.py{RESET}                - Run demo queries")
    print()
    print("For web scraping:")
    print(f"  {YELLOW}python web_scraper.py{RESET}         - Run standalone scraper")
    print()
    print("To add more documents:")
    print(f"  1. Place markdown files in {YELLOW}./data/{RESET} directory")
    print(f"  2. Run: {YELLOW}python cli.py ingest ./data/your-file.md{RESET}")
    print()
    print(f"{BLUE}{'='*70}{RESET}\n")


if __name__ == "__main__":
    try:
        setup_production_rag()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Setup interrupted by user{RESET}\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n{RED}Setup failed: {str(e)}{RESET}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
