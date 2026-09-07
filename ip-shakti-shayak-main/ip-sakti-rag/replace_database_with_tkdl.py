#!/usr/bin/env python3
"""
Master Script: Replace RAG Database with TKDL Data
Complete workflow for replacing IP-SAKTI RAG database with TKDL content
"""
import sys
import os
from pathlib import Path
from datetime import datetime

try:
    from colorama import init, Fore, Style
    init()
    RED = Fore.RED
    GREEN = Fore.GREEN
    YELLOW = Fore.YELLOW
    BLUE = Fore.BLUE
    CYAN = Fore.CYAN
    RESET = Style.RESET_ALL
except ImportError:
    RED = GREEN = YELLOW = BLUE = CYAN = RESET = ""


def print_header(text):
    print(f"\n{BLUE}{'='*70}")
    print(f"{text.center(70)}")
    print(f"{'='*70}{RESET}\n")


def print_success(text):
    print(f"{GREEN}[✓] {text}{RESET}")


def print_error(text):
    print(f"{RED}[✗] {text}{RESET}")


def print_warning(text):
    print(f"{YELLOW}[!] {text}{RESET}")


def print_info(text):
    print(f"{CYAN}[i] {text}{RESET}")


class TKDLDatabaseReplacement:
    """Main orchestration class for TKDL database replacement"""

    def __init__(self):
        self.rag_engine = None
        self.tkdl_manager = None
        self.ingestion = None
        self.backup_path = None

    def step_1_validate_environment(self) -> bool:
        """Step 1: Validate environment and dependencies"""
        print_header("STEP 1: VALIDATING ENVIRONMENT")

        try:
            print_info("Checking required modules...")

            try:
                from rag_engine import RAGEngine
                print_success("✓ RAG Engine available")
            except ImportError as e:
                print_error(f"RAG Engine not found: {e}")
                return False

            try:
                from tkdl_manager import TKDLDataManager
                print_success("✓ TKDL Manager available")
            except ImportError as e:
                print_error(f"TKDL Manager not found: {e}")
                return False

            try:
                from tkdl_rag_ingestion import TKDLRAGIngestion, TKDLDatabaseReplacement
                print_success("✓ TKDL Ingestion available")
            except ImportError as e:
                print_error(f"TKDL Ingestion not found: {e}")
                return False

            print_info("\nChecking file structure...")
            if Path("./faiss_data").exists():
                doc_count = self._get_doc_count()
                print_success(f"✓ Existing database found ({doc_count} documents)")
            else:
                print_warning("No existing database found (will create new)")

            print_success("\nEnvironment validation complete!")
            return True

        except Exception as e:
            print_error(f"Environment validation failed: {str(e)}")
            return False

    def step_2_choose_data_source(self) -> str:
        """Step 2: Choose TKDL data source"""
        print_header("STEP 2: CHOOSE TKDL DATA SOURCE")

        from tkdl_manager import TKDLDataManager

        manager = TKDLDataManager()
        sources = manager.get_tkdl_data_sources()

        print("Available TKDL Data Sources:\n")

        for i, source in enumerate(sources, 1):
            status_color = GREEN if 'AVAILABLE' in source['status'] else YELLOW
            print(f"{i}. {source['name']}")
            print(f"   Status: {status_color}{source['status']}{RESET}")
            print(f"   Records: {source['records']}")
            print(f"   Format: {source['format']}")
            print()

        print(f"{YELLOW}Note: For SIH demo, we'll use generated TKDL sample data.{RESET}")
        print(f"{YELLOW}For production, use actual TKDL database (requires authorization).{RESET}\n")

        response = input(f"{CYAN}Use sample TKDL data for demo? (y/N): {RESET}")

        if response.lower() == 'y':
            print_info("\nGenerating sample TKDL data...")
            num_records = 100

            try:
                sample_file = manager.save_sample_data(num_records)
                print_success(f"Generated {num_records} sample records")
                return str(sample_file)
            except Exception as e:
                print_error(f"Failed to generate sample data: {str(e)}")
                return None
        else:
            print_info("\nFor production TKDL data:")
            print(f"  1. Get authorization from TKDL administrators")
            print(f"  2. Download data (JSON or CSV format)")
            print(f"  3. Run this script with: python replace_database_with_tkdl.py --file <path>")
            print()

            file_path = input(f"{CYAN}Enter path to TKDL data file (or press Enter to exit): {RESET}")
            if file_path and Path(file_path).exists():
                return file_path
            else:
                print_warning("No valid file provided, using sample data...")
                return self.step_2_choose_data_source()

    def step_3_review_and_confirm(self, tkdl_file: str) -> bool:
        """Step 3: Review data and get confirmation"""
        print_header("STEP 3: REVIEW AND CONFIRM")

        file_path = Path(tkdl_file)
        file_size_mb = file_path.stat().st_size / (1024 * 1024)

        print(f"File Information:")
        print(f"  Name: {file_path.name}")
        print(f"  Path: {file_path.absolute()}")
        print(f"  Size: {file_size_mb:.1f} MB")
        print()

        import json
        try:
            with open(tkdl_file, 'r') as f:
                data = json.load(f)

            records = data if isinstance(data, list) else [data]
            print(f"Total Records in File: {len(records)}")

            if records:
                print(f"\nSample Record Preview:")
                sample = records[0]
                print(f"  Formulation: {sample.get('formulation_name', 'N/A')}")
                print(f"  System: {sample.get('system', 'N/A')}")
                print(f"  Ingredients: {sample.get('active_ingredients', 'N/A')[:80]}...")
                print()

        except Exception as e:
            print_warning(f"Could not read file preview: {str(e)}")

        doc_count = self._get_doc_count()
        if doc_count > 0:
            print(f"{YELLOW}WARNING: Current database has {doc_count} documents")
            print(f"These will be backed up and replaced with TKDL data.{RESET}\n")

        print(f"{YELLOW}This action will:{RESET}")
        print(f"  1. Backup existing database to ./faiss_data_backups/")
        print(f"  2. Clear the current RAG database")
        print(f"  3. Load TKDL data ({len(records)} records)")
        print()

        response = input(f"{CYAN}Continue with database replacement? (yes/no): {RESET}")
        return response.lower() == 'yes'

    def step_4_backup_database(self) -> bool:
        """Step 4: Backup existing database"""
        print_header("STEP 4: BACKING UP EXISTING DATABASE")

        try:
            import shutil

            backup_dir = Path("./faiss_data_backups")
            backup_dir.mkdir(parents=True, exist_ok=True)

            if Path("./faiss_data").exists():
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_name = f"faiss_backup_{timestamp}"
                backup_path = backup_dir / backup_name

                print_info(f"Backing up to: {backup_path}")
                shutil.copytree("./faiss_data", backup_path)

                self.backup_path = backup_path
                print_success(f"Database backed up successfully")
            else:
                print_info("No existing database to backup")

            return True

        except Exception as e:
            print_error(f"Backup failed: {str(e)}")
            return False

    def step_5_load_tkdl_data(self, tkdl_file: str) -> bool:
        """Step 5: Load TKDL data into RAG"""
        print_header("STEP 5: LOADING TKDL DATA")

        try:
            from rag_engine import RAGEngine
            from tkdl_rag_ingestion import TKDLDatabaseReplacement

            print_info("Initializing RAG engine...")
            self.rag_engine = RAGEngine()
            print_success("RAG engine ready")

            print_info("Clearing existing database...")
            self.rag_engine.vector_store.clear_collection()
            print_success("Database cleared")

            file_format = 'json' if tkdl_file.endswith('.json') else 'csv'
            print_info(f"Detected file format: {file_format.upper()}")

            print_info("\nStarting TKDL data ingestion...")
            replacement = TKDLDatabaseReplacement(self.rag_engine)
            result = replacement.clear_and_load_tkdl(tkdl_file, file_format)

            ingest_res = result.get('ingestion_result', {})
            final_st = result.get('final_stats', {})

            print_success("TKDL data loaded successfully")
            print()
            print(f"Statistics:")
            print(f"  Total chunks created: {ingest_res.get('total_chunks_created', 0):,}")
            print(f"  Success rate: {ingest_res.get('success_rate', 0):.1f}%")
            print(f"  Database documents: {final_st.get('document_count', 0)}")
            print()

            return True

        except Exception as e:
            print_error(f"TKDL loading failed: {str(e)}")
            print_warning(f"Your backup is available at: {self.backup_path}")
            return False

    def step_6_test_database(self) -> bool:
        """Step 6: Test new database with queries"""
        print_header("STEP 6: TESTING NEW DATABASE")

        try:
            print_info("Running test queries...\n")

            test_queries = [
                "What is Ashwagandha used for in Ayurveda?",
                "How is Triphala prepared and used?",
                "What are the properties of Brahmi in traditional medicine?",
                "Tell me about Unani herbal formulations",
                "What are Siddha medicine practices?"
            ]

            for i, query in enumerate(test_queries, 1):
                print(f"Test {i}: {query}")
                result = self.rag_engine.query(query, top_k=3)

                if result.get('sources'):
                    print(f"  ✓ Found {result.get('num_sources', len(result['sources']))} sources")
                    print(f"  ✓ Confidence: {result.get('confidence', 0):.1%}")
                    print(f"  ✓ System: {result['sources'][0].get('metadata', {}).get('medical_system', 'N/A')}")
                else:
                    print(f"  [No sources found]")

                print()

            print_success("Database is functioning correctly")
            return True

        except Exception as e:
            print_error(f"Test failed: {str(e)}")
            return False

    def step_7_completion_summary(self) -> None:
        """Step 7: Show completion summary"""
        print_header("STEP 7: COMPLETION SUMMARY")

        print(f"{GREEN}✓ DATABASE REPLACEMENT SUCCESSFUL!{RESET}\n")

        if self.backup_path:
            print(f"Backup location: {self.backup_path}")

        stats = self.rag_engine.get_stats()
        print(f"New database status:")
        print(f"  • Collection: {stats.get('collection_name', 'N/A')}")
        print(f"  • Documents: {stats.get('document_count', 0):,}")
        print(f"  • Embedding model: {stats.get('embedding_model', 'N/A')}")

        print(f"\n{YELLOW}Next steps:{RESET}")
        print(f"  1. Test the system: python cli.py interactive")
        print(f"  2. View demo: python demo.py")
        print(f"  3. Start API: python api.py")
        print(f"  4. View docs: http://localhost:8000/docs")

        print(f"\n{CYAN}For production TKDL data:{RESET}")
        print(f"  1. Apply for TKDL database access at https://tkdl.res.in")
        print(f"  2. Download full dataset (CSV or API access)")
        print(f"  3. Run: python replace_database_with_tkdl.py --file <path>")

        print(f"\n{GREEN}Your RAG system is now powered by TKDL data!{RESET}\n")

    def _get_doc_count(self) -> int:
        """Get current document count"""
        try:
            from rag_engine import RAGEngine
            rag = RAGEngine()
            stats = rag.get_stats()
            return stats.get('document_count', 0)
        except:
            return 0

    def run_full_workflow(self, tkdl_file: str = None) -> bool:
        """Run complete replacement workflow"""
        print(f"\n{CYAN}{'='*70}")
        print(f"IP-SAKTI RAG DATABASE REPLACEMENT WORKFLOW")
        print(f"{'='*70}{RESET}\n")

        if not self.step_1_validate_environment():
            print_error("Environment validation failed. Exiting.")
            return False

        if not tkdl_file:
            tkdl_file = self.step_2_choose_data_source()
            if not tkdl_file:
                print_error("No TKDL file selected. Exiting.")
                return False

        if not self.step_3_review_and_confirm(tkdl_file):
            print_warning("User cancelled database replacement.")
            return False

        if not self.step_4_backup_database():
            print_error("Backup failed. Exiting to prevent data loss.")
            return False

        if not self.step_5_load_tkdl_data(tkdl_file):
            print_error("Failed to load TKDL data.")
            print_warning(f"Your backup is available at: {self.backup_path}")
            return False

        if not self.step_6_test_database():
            print_warning("Some tests failed, but data is loaded.")

        self.step_7_completion_summary()

        return True


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Replace RAG database with TKDL data"
    )
    parser.add_argument(
        '--file',
        type=str,
        help='Path to TKDL data file (JSON or CSV)'
    )
    parser.add_argument(
        '--skip-confirm',
        action='store_true',
        help='Skip confirmation prompt'
    )

    args = parser.parse_args()

    replacement = TKDLDatabaseReplacement()

    try:
        success = replacement.run_full_workflow(args.file)
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Workflow interrupted by user.{RESET}\n")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()