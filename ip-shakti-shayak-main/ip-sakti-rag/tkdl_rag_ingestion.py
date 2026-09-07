"""
TKDL-Specific RAG Ingestion Module
Enhanced ingestion pipeline optimized for TKDL data
"""
import logging
from typing import List, Dict, Optional, Tuple
from pathlib import Path
import json
from datetime import datetime
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TKDLRAGIngestion:
    """
    Specialized ingestion module for TKDL data
    Handles large-scale data ingestion with progress tracking
    """

    def __init__(self, rag_engine):
        self.rag_engine = rag_engine
        self.ingestion_stats = {
            'total_records': 0,
            'successfully_ingested': 0,
            'successful_ingested': 0,  # Alias to prevent KeyError
            'failed_records': 0,
            'total_chunks': 0,
            'start_time': None,
            'end_time': None,
            'errors': []
        }

    def ingest_tkdl_json(self, json_file: str, batch_size: int = 100) -> Dict:
        """
        Ingest TKDL data from JSON file in batches
        This prevents memory overflow with large datasets
        """
        self.ingestion_stats['start_time'] = datetime.now()

        file_path = Path(json_file)
        if not file_path.exists():
            raise FileNotFoundError(f"TKDL file not found: {json_file}")

        logger.info(f"Starting TKDL ingestion from {json_file}")
        logger.info(f"Batch size: {batch_size} records")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Handle both list and single record
            records = data if isinstance(data, list) else [data]
            self.ingestion_stats['total_records'] = len(records)

            logger.info(f"Total records to process: {len(records)}")

            # Process in batches
            for batch_num, i in enumerate(range(0, len(records), batch_size), 1):
                batch = records[i:i + batch_size]
                logger.info(f"\nProcessing batch {batch_num} ({len(batch)} records)...")

                batch_result = self._ingest_batch(batch)

                self.ingestion_stats['successfully_ingested'] += batch_result['successful']
                self.ingestion_stats['successful_ingested'] += batch_result['successful']
                self.ingestion_stats['failed_records'] += batch_result['failed']
                self.ingestion_stats['total_chunks'] += batch_result['chunks_added']

                # Progress update
                progress = (self.ingestion_stats['successfully_ingested'] / 
                           max(self.ingestion_stats['total_records'], 1) * 100)
                logger.info(f"Progress: {progress:.1f}% "
                           f"({self.ingestion_stats['successfully_ingested']}/{self.ingestion_stats['total_records']})")

                # Small delay to prevent overwhelming the system
                time.sleep(0.1)

        except Exception as e:
            logger.error(f"Error during ingestion: {str(e)}")
            self.ingestion_stats['errors'].append(str(e))
            raise

        finally:
            self.ingestion_stats['end_time'] = datetime.now()

        return self._generate_ingestion_report()

    def _ingest_batch(self, batch: List[Dict]) -> Dict:
        """Ingest a batch of records safely"""
        batch_stats = {
            'successful': 0,
            'failed': 0,
            'chunks_added': 0
        }

        for record in batch:
            try:
                # Format the record for RAG
                chunks = self._format_record_to_chunks(record)

                # Add to vector store
                if chunks:
                    res = self.rag_engine.vector_store.add_documents(chunks)
                    if isinstance(res, int):
                        num_added = res
                    elif isinstance(res, list):
                        num_added = len(res)
                    elif isinstance(res, dict):
                        num_added = res.get('chunks_added', res.get('successfully_ingested', res.get('successful_ingested', 1)))
                    else:
                        num_added = len(chunks)

                    batch_stats['successful'] += 1
                    batch_stats['chunks_added'] += num_added
                else:
                    batch_stats['failed'] += 1

            except Exception as e:
                logger.warning(f"Failed to ingest record: {str(e)}")
                batch_stats['failed'] += 1
                self.ingestion_stats['errors'].append(str(e))

        return batch_stats

    def _format_record_to_chunks(self, record: Dict) -> List[Dict]:
        """
        Convert TKDL record to chunks for embedding
        Optimized for semantic search
        """
        if isinstance(record, str):
            try:
                record = json.loads(record)
            except:
                return []

        if not isinstance(record, dict):
            return []

        # Extract key fields
        formulation = record.get('formulation_name', 'Unknown')
        ingredients = record.get('active_ingredients', '')
        properties = record.get('properties', '')
        uses = record.get('uses', '')
        system = record.get('system', 'Ayurveda')

        chunk_text = f"""
        Traditional Medicine Formulation: {formulation}
        System: {system}
        
        Ingredients:
        {ingredients}
        
        Medicinal Properties:
        {properties}
        
        Therapeutic Uses and Applications:
        {uses}
        
        Preparation Method: {record.get('preparation_method', 'Traditional method')}
        Recommended Dosage: {record.get('dosage', 'Consult practitioner')}
        
        Contraindications and Warnings:
        {record.get('contraindications', 'None specified')}
        
        Traditional Historical Reference:
        {record.get('traditional_source', 'Ancient texts and manuscripts')}
        """

        metadata = {
            'source': 'TKDL Database',
            'tkdl_id': record.get('id', 'Unknown'),
            'formulation_name': formulation,
            'medical_system': system,
            'category': record.get('category', 'Herbal Formulation'),
            'keywords': f"{formulation} {ingredients} {properties}",
            'indexed_date': record.get('indexed_date', datetime.now().isoformat()),
            'ingestion_timestamp': datetime.now().isoformat()
        }

        return [{
            'text': chunk_text.strip(),
            'metadata': metadata
        }]

    def ingest_tkdl_csv(self, csv_file: str, batch_size: int = 100) -> Dict:
        """Ingest TKDL data from CSV file"""
        import csv

        self.ingestion_stats['start_time'] = datetime.now()

        file_path = Path(csv_file)
        if not file_path.exists():
            raise FileNotFoundError(f"CSV file not found: {csv_file}")

        logger.info(f"Starting TKDL CSV ingestion from {csv_file}")

        batch = []
        batch_num = 0

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)

                for i, row in enumerate(reader):
                    self.ingestion_stats['total_records'] = i + 1
                    batch.append(row)

                    if len(batch) >= batch_size:
                        batch_num += 1
                        logger.info(f"Processing batch {batch_num} ({len(batch)} records)...")

                        batch_result = self._ingest_batch(batch)
                        self.ingestion_stats['successfully_ingested'] += batch_result['successful']
                        self.ingestion_stats['successful_ingested'] += batch_result['successful']
                        self.ingestion_stats['total_chunks'] += batch_result['chunks_added']

                        batch = []

                if batch:
                    batch_num += 1
                    logger.info(f"Processing final batch {batch_num} ({len(batch)} records)...")

                    batch_result = self._ingest_batch(batch)
                    self.ingestion_stats['successfully_ingested'] += batch_result['successful']
                    self.ingestion_stats['successful_ingested'] += batch_result['successful']
                    self.ingestion_stats['total_chunks'] += batch_result['chunks_added']

        except Exception as e:
            logger.error(f"Error during CSV ingestion: {str(e)}")
            self.ingestion_stats['errors'].append(str(e))
            raise

        finally:
            self.ingestion_stats['end_time'] = datetime.now()

        return self._generate_ingestion_report()

    def _generate_ingestion_report(self) -> Dict:
        """Generate ingestion statistics report supporting both key variants"""
        duration = None
        if self.ingestion_stats['start_time'] and self.ingestion_stats['end_time']:
            duration = (self.ingestion_stats['end_time'] - 
                       self.ingestion_stats['start_time']).total_seconds()

        report = {
            'status': 'success',
            'total_records_processed': self.ingestion_stats['total_records'],
            'successfully_ingested': self.ingestion_stats['successfully_ingested'],
            'successful_ingested': self.ingestion_stats['successfully_ingested'],
            'failed_records': self.ingestion_stats['failed_records'],
            'total_chunks_created': self.ingestion_stats['total_chunks'],
            'success_rate': (self.ingestion_stats['successfully_ingested'] / 
                            max(self.ingestion_stats['total_records'], 1) * 100),
            'duration_seconds': duration,
            'errors': self.ingestion_stats['errors']
        }

        return report

    def print_ingestion_report(self):
        """Print formatted ingestion report"""
        report = self._generate_ingestion_report()

        print("\n" + "="*70)
        print("TKDL INGESTION REPORT")
        print("="*70)
        print(f"Status: {report['status'].upper()}")
        print(f"Total Records: {report['total_records_processed']:,}")
        print(f"Successfully Ingested: {report['successfully_ingested']:,}")
        print(f"Failed: {report['failed_records']:,}")
        print(f"Success Rate: {report['success_rate']:.1f}%")
        print(f"Total Chunks Created: {report['total_chunks_created']:,}")

        if report['duration_seconds']:
            records_per_sec = report['successfully_ingested'] / report['duration_seconds']
            print(f"Duration: {report['duration_seconds']:.1f} seconds")
            print(f"Ingestion Speed: {records_per_sec:.1f} records/second")

        if report['errors']:
            print(f"\nErrors ({len(report['errors'])}):")
            for error in report['errors'][:5]:
                print(f"  - {error}")

        print("="*70 + "\n")

        return report


class TKDLDatabaseReplacement:
    """Handle replacing existing database with TKDL data"""

    def __init__(self, rag_engine):
        self.rag_engine = rag_engine
        self.tkdl_ingestion = TKDLRAGIngestion(rag_engine)

    def clear_and_load_tkdl(self, tkdl_file: str, file_format: str = 'json') -> Dict:
        """
        Complete database replacement workflow
        1. Backup existing database
        2. Clear current database
        3. Load TKDL data
        """
        logger.info("\n" + "="*70)
        logger.info("TKDL DATABASE REPLACEMENT WORKFLOW")
        logger.info("="*70 + "\n")

        logger.info("Step 1: Backing up existing database...")
        backup_path = self._backup_existing_database()
        logger.info(f"✓ Database backed up to: {backup_path}\n")

        logger.info("Step 2: Clearing existing database...")
        self.rag_engine.vector_store.clear_collection()
        logger.info("✓ Database cleared\n")

        stats = self.rag_engine.get_stats()
        logger.info(f"Current database status: {stats.get('document_count', 0)} documents\n")

        logger.info("Step 3: Loading TKDL data...")
        if file_format.lower() == 'json':
            ingestion_result = self.tkdl_ingestion.ingest_tkdl_json(tkdl_file)
        elif file_format.lower() == 'csv':
            ingestion_result = self.tkdl_ingestion.ingest_tkdl_csv(tkdl_file)
        else:
            raise ValueError(f"Unsupported format: {file_format}")

        self.tkdl_ingestion.print_ingestion_report()

        logger.info("Step 4: Verifying new database...")
        final_stats = self.rag_engine.get_stats()
        logger.info(f"✓ New database has {final_stats.get('document_count', 0)} documents\n")

        logger.info("="*70)
        logger.info("DATABASE REPLACEMENT COMPLETE")
        logger.info("="*70)
        logger.info(f"Backup location: {backup_path}")
        logger.info(f"New documents: {ingestion_result.get('total_chunks_created', 0):,}")
        logger.info(f"Success rate: {ingestion_result.get('success_rate', 0):.1f}%\n")

        return {
            'status': 'success',
            'backup_path': str(backup_path),
            'ingestion_result': ingestion_result,
            'final_stats': final_stats
        }

    def _backup_existing_database(self) -> Path:
        """Backup existing FAISS database"""
        import shutil

        backup_dir = Path("./faiss_data_backups")
        backup_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"faiss_backup_{timestamp}"
        backup_path = backup_dir / backup_name

        if Path("./faiss_data").exists():
            shutil.copytree("./faiss_data", backup_path)
            logger.info(f"Database backed up to {backup_path}")
        else:
            logger.info("No existing database to backup")

        return backup_path


def main():
    """Demo TKDL RAG Ingestion"""
    from tkdl_manager import TKDLDataManager
    from rag_engine import RAGEngine

    manager = TKDLDataManager()
    print("Generating sample TKDL data...")
    sample_file = manager.save_sample_data(50)

    print("Initializing RAG engine...")
    rag = RAGEngine()

    replacement = TKDLDatabaseReplacement(rag)
    result = replacement.clear_and_load_tkdl(str(sample_file), 'json')

    print("\nTesting queries on new TKDL database...")
    test_queries = [
        "What is Ashwagandha used for?",
        "How to prepare Triphala?",
        "Tell me about Brahmi Basti formulation"
    ]

    for query in test_queries:
        print(f"\nQuery: {query}")
        result = rag.query(query, top_k=3)
        print(f"Answer: {result['answer'][:200]}...")
        print(f"Confidence: {result['confidence']:.1%}")


if __name__ == "__main__":
    main()