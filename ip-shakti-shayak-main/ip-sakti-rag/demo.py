#!/usr/bin/env python3
"""
Simple demo script for IP-SAKTI Sahayak RAG System
"""
from rag_engine import RAGEngine
import sys

def main():
    print("\n" + "="*60)
    print("IP-SAKTI Sahayak RAG System - Quick Demo")
    print("="*60 + "\n")

    # Initialize RAG
    print("Initializing RAG engine...")
    rag = RAGEngine()

    # Check if document is already ingested
    stats = rag.get_stats()
    if stats['document_count'] == 0:
        print("\nIngesting presentation document...")
        doc_path = r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md"
        try:
            result = rag.ingest_document(doc_path)
            print(f"Successfully ingested {result['chunks_added']} chunks!\n")
        except FileNotFoundError:
            print("\nERROR: Presentation file not found!")
            print("Please ensure the file exists at:")
            print(r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md")
            sys.exit(1)
    else:
        print(f"Document already loaded ({stats['document_count']} chunks)\n")

    # Demo queries
    demo_queries = [
        "What are the project objectives?",
        "What is the team structure?",
        "What technologies are used in the AI/ML stack?",
        "What is the budget estimate?",
        "What are the success metrics?"
    ]

    for i, query in enumerate(demo_queries, 1):
        print(f"\n{'='*60}")
        print(f"Query {i}: {query}")
        print('='*60)

        result = rag.query(query, top_k=3)

        print(f"\nAnswer:")
        print("-" * 60)
        print(result['answer'])
        print("-" * 60)

        print(f"\nConfidence: {result['confidence']:.2%}")
        sources = ', '.join([f"Slide {s['slide_number']}" for s in result['sources'][:3]])
        print(f"Sources: {sources}")

    print("\n" + "="*60)
    print("Demo completed!")
    print("="*60 + "\n")
    print("Try the interactive mode: python cli.py interactive")
    print("Or start the API server: python api.py")
    print()


if __name__ == "__main__":
    main()
