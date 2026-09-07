#!/usr/bin/env python3
"""
Test script for the RAG system
"""
from rag_engine import RAGEngine
from rich.console import Console
from rich.panel import Panel

console = Console()


def test_rag_system():
    """Test the RAG system end-to-end"""

    console.print("\n[bold blue]Testing IP-SAKTI Sahayak RAG System[/bold blue]\n")

    # Initialize RAG
    console.print("1. Initializing RAG engine...")
    rag = RAGEngine()
    console.print("[green]SUCCESS: RAG engine initialized[/green]\n")

    # Ingest document
    console.print("2. Ingesting presentation document...")
    doc_path = r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md"
    result = rag.ingest_document(doc_path)
    console.print(f"[green]SUCCESS: Ingested {result['chunks_added']} chunks[/green]\n")

    # Get stats
    console.print("3. Getting system statistics...")
    stats = rag.get_stats()
    console.print(f"[green]SUCCESS: Collection: {stats['collection_name']}[/green]")
    console.print(f"[green]SUCCESS: Documents: {stats['document_count']}[/green]")
    console.print(f"[green]SUCCESS: Model: {stats['embedding_model']}[/green]\n")

    # Test queries
    test_queries = [
        "What are the project objectives?",
        "What is the team structure?",
        "What are the success metrics?",
        "What technologies are used?",
        "What is the budget estimate?"
    ]

    console.print("4. Testing queries...\n")

    for i, query in enumerate(test_queries, 1):
        console.print(f"[bold cyan]Query {i}:[/bold cyan] {query}")
        result = rag.query(query, top_k=3)

        console.print(Panel(
            result['answer'][:200] + "..." if len(result['answer']) > 200 else result['answer'],
            title=f"Answer (Confidence: {result['confidence']:.3f})",
            border_style="green"
        ))

        if result['sources']:
            sources_text = ', '.join([f"Slide {s['slide_number']}" for s in result['sources'][:2]])
            console.print(f"[dim]-> Sources: {sources_text}[/dim]\n")

    console.print("[bold green]SUCCESS: All tests passed![/bold green]\n")


if __name__ == "__main__":
    try:
        test_rag_system()
    except FileNotFoundError:
        console.print("\n[red]Error: Presentation file not found![/red]")
        console.print("[yellow]Please ensure the file exists at:[/yellow]")
        console.print(r"C:\Users\Anshul Yadav\Downloads\IP_SAKTI_Sahayak_Presentation.md")
        console.print()
    except Exception as e:
        console.print(f"\n[red]Error: {str(e)}[/red]\n")
