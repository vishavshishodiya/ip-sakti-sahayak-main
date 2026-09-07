#!/usr/bin/env python3
"""
Command-line interface for IP-SAKTI Sahayak RAG system
"""
import argparse
from pathlib import Path
from rag_engine import RAGEngine
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.markdown import Markdown

console = Console()


def ingest_command(args):
    """Ingest a document into the RAG system"""
    console.print(f"\n[bold blue]Ingesting document:[/bold blue] {args.file_path}")

    rag = RAGEngine()
    result = rag.ingest_document(args.file_path)

    console.print(f"[green]✓ Successfully ingested {result['chunks_added']} chunks[/green]\n")


def query_command(args):
    """Query the RAG system"""
    rag = RAGEngine()

    console.print(f"\n[bold blue]Query:[/bold blue] {args.query}\n")

    result = rag.query(args.query, args.top_k)

    # Display answer
    console.print(Panel(
        result['answer'],
        title="Answer",
        border_style="green"
    ))

    # Display sources
    if result['sources']:
        console.print("\n[bold]Sources:[/bold]")
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("#", style="dim")
        table.add_column("Title")
        table.add_column("Slide")
        table.add_column("Relevance", justify="right")

        for source in result['sources']:
            table.add_row(
                str(source['source_number']),
                source['title'],
                str(source['slide_number']),
                f"{source['relevance_score']:.3f}"
            )

        console.print(table)

    # Display metadata
    console.print(f"\n[dim]Confidence: {result['confidence']:.3f} | Sources: {result['num_sources']}[/dim]\n")


def stats_command(args):
    """Display RAG system statistics"""
    rag = RAGEngine()
    stats = rag.get_stats()

    console.print("\n[bold blue]RAG System Statistics[/bold blue]\n")

    table = Table(show_header=False)
    table.add_column("Property", style="cyan")
    table.add_column("Value", style="green")

    table.add_row("Collection Name", stats['collection_name'])
    table.add_row("Document Count", str(stats['document_count']))
    table.add_row("Embedding Model", stats['embedding_model'])

    console.print(table)
    console.print()


def interactive_command(args):
    """Start interactive query mode"""
    rag = RAGEngine()

    console.print("\n[bold green]IP-SAKTI Sahayak RAG - Interactive Mode[/bold green]")
    console.print("[dim]Type 'exit' or 'quit' to exit[/dim]\n")

    while True:
        try:
            query = console.input("[bold blue]Query:[/bold blue] ")

            if query.lower() in ['exit', 'quit', 'q']:
                console.print("\n[yellow]Goodbye![/yellow]\n")
                break

            if not query.strip():
                continue

            result = rag.query(query, args.top_k)

            console.print(f"\n[bold green]Answer:[/bold green]")
            console.print(result['answer'])

            console.print(f"\n[dim]Confidence: {result['confidence']:.3f} | Sources: {result['num_sources']}[/dim]\n")

        except KeyboardInterrupt:
            console.print("\n\n[yellow]Goodbye![/yellow]\n")
            break
        except Exception as e:
            console.print(f"\n[red]Error:[/red] {str(e)}\n")


def main():
    parser = argparse.ArgumentParser(
        description="IP-SAKTI Sahayak RAG CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Ingest command
    ingest_parser = subparsers.add_parser('ingest', help='Ingest a document')
    ingest_parser.add_argument('file_path', help='Path to markdown file')

    # Query command
    query_parser = subparsers.add_parser('query', help='Query the RAG system')
    query_parser.add_argument('query', help='Query string')
    query_parser.add_argument('-k', '--top-k', type=int, default=5, help='Number of results')

    # Stats command
    stats_parser = subparsers.add_parser('stats', help='Show system statistics')

    # Interactive command
    interactive_parser = subparsers.add_parser('interactive', help='Interactive query mode')
    interactive_parser.add_argument('-k', '--top-k', type=int, default=5, help='Number of results')

    args = parser.parse_args()

    if args.command == 'ingest':
        ingest_command(args)
    elif args.command == 'query':
        query_command(args)
    elif args.command == 'stats':
        stats_command(args)
    elif args.command == 'interactive':
        interactive_command(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
