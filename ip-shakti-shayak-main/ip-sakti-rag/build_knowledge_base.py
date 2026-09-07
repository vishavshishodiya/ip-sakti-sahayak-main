#!/usr/bin/env python3
"""
Build Production Knowledge Base - Non-Interactive
"""
import sys
from pathlib import Path

print("\n" + "="*70)
print("IP-SAKTI SAHAYAK - BUILDING PRODUCTION KNOWLEDGE BASE")
print("="*70 + "\n")

# Import modules
print("[1/5] Loading modules...")
try:
    from rag_engine import RAGEngine
    from web_scraper import scrape_sample_ayurveda_content
    from ingestion_pipeline import DocumentIngestionPipeline
    print("     SUCCESS: Modules loaded\n")
except ImportError as e:
    print(f"     ERROR: {e}\n")
    sys.exit(1)

# Initialize RAG
print("[2/5] Initializing RAG engine...")
rag = RAGEngine()
stats = rag.get_stats()
print(f"     SUCCESS: Current database has {stats['document_count']} documents\n")

# Ingest presentation
print("[3/5] Ingesting presentation document...")
presentation_path = r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md"

if Path(presentation_path).exists():
    if stats['document_count'] == 0:
        result = rag.ingest_document(presentation_path)
        print(f"     SUCCESS: Added {result['chunks_added']} chunks\n")
    else:
        print(f"     SKIPPED: Database already populated\n")
else:
    print(f"     WARNING: Presentation not found\n")

# Optional: Scrape web content (commented out by default)
print("[4/5] Web scraping...")
print("     SKIPPED: To enable, edit build_knowledge_base.py\n")
# Uncomment below to enable web scraping:
# print("     Scraping web content (may take 2-3 minutes)...")
# try:
#     documents = scrape_sample_ayurveda_content()
#     pipeline = DocumentIngestionPipeline(rag)
#     result = pipeline.ingest_scraped_data()
#     print(f"     SUCCESS: Added {result['chunks_added']} chunks from web\n")
# except Exception as e:
#     print(f"     WARNING: Scraping failed - {str(e)}\n")

# Ingest additional documents from ./data/
print("[5/5] Checking for additional documents...")
data_dir = Path("./data")
if data_dir.exists():
    md_files = list(data_dir.glob("*.md"))
    if md_files:
        print(f"     Found {len(md_files)} markdown files")
        pipeline = DocumentIngestionPipeline(rag)
        result = pipeline.ingest_directory("./data", "*.md")
        print(f"     SUCCESS: Added {result['total_chunks']} chunks from {result['files_processed']} files\n")
    else:
        print(f"     No markdown files in ./data/\n")
else:
    print(f"     No ./data/ directory found\n")

# Final statistics
print("="*70)
print("KNOWLEDGE BASE READY")
print("="*70)

final_stats = rag.get_stats()
print(f"\nDatabase: {final_stats['collection_name']}")
print(f"Total Documents: {final_stats['document_count']}")
print(f"Embedding Model: {final_stats['embedding_model']}")

# Test queries
print("\n" + "="*70)
print("RUNNING TEST QUERIES")
print("="*70 + "\n")

test_queries = [
    "What are the project objectives?",
    "What is the team structure?",
    "What technologies are used?"
]

for i, query in enumerate(test_queries, 1):
    print(f"Test {i}: {query}")
    try:
        result = rag.query(query, top_k=3)
        print(f"  - Confidence: {result['confidence']:.1%}")
        print(f"  - Sources: {result['num_sources']}")
        print(f"  - Method: {result['method']}")
    except Exception as e:
        print(f"  - ERROR: {str(e)}")
    print()

print("="*70)
print("SETUP COMPLETE!")
print("="*70)
print("\nNext steps:")
print("  python cli.py interactive    # Interactive queries")
print("  python api.py                # Start REST API")
print("  python demo.py               # Run demo\n")
