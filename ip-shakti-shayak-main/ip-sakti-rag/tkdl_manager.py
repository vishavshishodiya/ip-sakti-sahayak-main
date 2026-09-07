"""
TKDL (Traditional Knowledge Digital Library) Data Manager
Handles acquisition, processing, and ingestion of TKDL data
"""
import os
import json
import logging
from typing import List, Dict, Optional, Tuple
from pathlib import Path
import csv
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TKDLDataManager:
    """Manage TKDL data sources and formats"""

    # TKDL Categories
    CATEGORIES = {
        'ayurveda': 'Ayurveda - Traditional Indian Medicine',
        'unani': 'Unani - Traditional Persian Medicine',
        'siddha': 'Siddha - Traditional Tamil Medicine',
        'yoga': 'Yoga and Wellness',
        'herbal': 'Herbal Preparations and Formulations'
    }

    # Knowledge structure
    TKDL_FIELDS = [
        'formulation_name',      # Name of preparation
        'active_ingredients',    # Main ingredients
        'properties',           # Medicinal properties
        'uses',                 # Therapeutic uses
        'preparation_method',   # How to prepare
        'dosage',              # Recommended dosage
        'contraindications',    # Warnings/side effects
        'traditional_source',   # Traditional reference
        'historical_evidence',  # Historical records
        'system',              # Ayurveda/Unani/Siddha
    ]

    def __init__(self, data_dir: str = "./tkdl_data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Subdirectories for different data sources
        self.raw_dir = self.data_dir / "raw"
        self.processed_dir = self.data_dir / "processed"
        self.metadata_dir = self.data_dir / "metadata"
        
        for dir_path in [self.raw_dir, self.processed_dir, self.metadata_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)

    # ============================================================================
    # 1. DATA ACQUISITION STRATEGIES
    # ============================================================================

    def get_tkdl_data_sources(self) -> List[Dict]:
        """
        Return available TKDL data sources and how to access them
        
        IMPORTANT: TKDL database requires special access. These are the methods:
        """
        sources = [
            {
                'name': 'TKDL Official Database',
                'url': 'https://tkdl.res.in',
                'access': 'Official registration required',
                'records': '~34 million pages',
                'format': 'PDF/HTML',
                'cost': 'Free (with institutional access)',
                'method': 'Direct API or download',
                'status': 'RESTRICTED - Requires authorization'
            },
            {
                'name': 'TKDL Public Excerpts',
                'url': 'https://tkdl.res.in/tkdl_search/search',
                'access': 'Public search interface',
                'records': 'Publicly searchable subset',
                'format': 'Web interface',
                'cost': 'Free',
                'method': 'Web scraping with rate limiting',
                'status': 'AVAILABLE - Limited by terms'
            },
            {
                'name': 'Patent Office TKDL Reference',
                'url': 'https://ipindia.gov.in/tkdl',
                'access': 'IP India portal',
                'records': 'Patent-related entries',
                'format': 'PDF/HTML',
                'cost': 'Free',
                'method': 'Download or API',
                'status': 'AVAILABLE'
            },
            {
                'name': 'Government of India TKDL',
                'url': 'https://data.gov.in/',
                'access': "India's Open Data Portal",
                'records': 'Public datasets',
                'format': 'CSV/JSON',
                'cost': 'Free',
                'method': 'Direct download',
                'status': 'AVAILABLE'
            },
            {
                'name': 'TKDL Research API',
                'url': 'https://tkdl.res.in/api',
                'access': 'Research institutions',
                'records': 'Full database',
                'format': 'JSON/XML',
                'cost': 'Institutional access required',
                'method': 'REST API',
                'status': 'REQUIRES REGISTRATION'
            }
        ]
        return sources

    def display_tkdl_sources(self):
        """Display available TKDL data sources"""
        sources = self.get_tkdl_data_sources()
        
        logger.info("\n" + "="*80)
        logger.info("AVAILABLE TKDL DATA SOURCES")
        logger.info("="*80 + "\n")
        
        for i, source in enumerate(sources, 1):
            logger.info(f"Option {i}: {source['name']}")
            logger.info(f"  URL: {source['url']}")
            logger.info(f"  Access: {source['access']}")
            logger.info(f"  Records: {source['records']}")
            logger.info(f"  Status: {source['status']}")
            logger.info(f"  Method: {source['method']}\n")

    # ============================================================================
    # 2. SAMPLE DATA GENERATION (for development)
    # ============================================================================

    def generate_sample_tkdl_data(self, num_records: int = 100) -> List[Dict]:
        """
        Generate sample TKDL-like data for development/testing
        This simulates real TKDL structure without actual restricted data
        """
        sample_data = []

        # Sample Ayurveda formulations
        formulations = [
            {
                'name': 'Ashwagandha Churna',
                'ingredients': ['Ashwagandha root', 'Ginger', 'Honey'],
                'properties': 'Adaptogen, immune booster',
                'uses': 'Stress relief, energy, sleep',
                'system': 'Ayurveda',
            },
            {
                'name': 'Triphala',
                'ingredients': ['Haritaki', 'Bibhitaki', 'Amalaki'],
                'properties': 'Laxative, antioxidant',
                'uses': 'Digestion, detoxification',
                'system': 'Ayurveda',
            },
            {
                'name': 'Brahmi Basti',
                'ingredients': ['Brahmi', 'Sesame oil', 'Rock salt'],
                'properties': 'Cognitive enhancer',
                'uses': 'Memory, mental clarity',
                'system': 'Ayurveda',
            },
            {
                'name': 'Hamdard Roghan Badam',
                'ingredients': ['Almond oil', 'Sandalwood', 'Rose'],
                'properties': 'Cooling, nourishing',
                'uses': 'Skin health, brain tonic',
                'system': 'Unani',
            },
            {
                'name': 'Kaya Kalpa Rasayana',
                'ingredients': ['Gold ash', 'Herbs', 'Ghee'],
                'properties': 'Rejuvenative',
                'uses': 'Longevity, vitality',
                'system': 'Siddha',
            }
        ]

        # Generate records
        for i in range(num_records):
            formulation = formulations[i % len(formulations)]
            record = {
                'id': f'TKDL_{i+1:07d}',
                'formulation_name': f"{formulation['name']} (Variant {i//len(formulations) + 1})",
                'active_ingredients': ', '.join(formulation['ingredients']),
                'properties': formulation['properties'],
                'uses': formulation['uses'],
                'preparation_method': 'Traditional method - powder or decoction',
                'dosage': '2-5 grams twice daily with warm water',
                'contraindications': 'Not recommended during pregnancy without consultation',
                'traditional_source': f'Referenced in ancient texts, variant {i+1}',
                'historical_evidence': 'Used for centuries in traditional medicine',
                'system': formulation['system'],
                'indexed_date': datetime.now().isoformat(),
                'category': 'Herbal Preparation',
                'keywords': formulation['properties'] + ' ' + formulation['uses'],
            }
            sample_data.append(record)

        return sample_data

    def save_sample_data(self, num_records: int = 100) -> Path:
        """Save sample TKDL data to file"""
        sample_data = self.generate_sample_tkdl_data(num_records)
        
        output_file = self.raw_dir / f"sample_tkdl_{num_records}_records.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved {num_records} sample TKDL records to {output_file}")
        return output_file

    # ============================================================================
    # 3. DATA PROCESSING AND FORMATTING
    # ============================================================================

    def format_tkdl_record(self, record: Dict) -> Dict:
        """
        Format TKDL record for RAG ingestion
        Converts structured TKDL data into formatted text chunks
        """
        # Create readable text from structured data
        text_parts = [
            f"FORMULATION: {record.get('formulation_name', 'Unknown')}",
            f"SYSTEM: {record.get('system', 'Unknown')}",
            f"\nINGREDIENTS:\n{record.get('active_ingredients', 'Not specified')}",
            f"\nPROPERTIES:\n{record.get('properties', 'Not specified')}",
            f"\nTHERAPEUTIC USES:\n{record.get('uses', 'Not specified')}",
            f"\nPREPARATION METHOD:\n{record.get('preparation_method', 'Not specified')}",
            f"\nRECOMMENDED DOSAGE:\n{record.get('dosage', 'Consult practitioner')}",
            f"\nCONTRAINDICATIONS:\n{record.get('contraindications', 'None specified')}",
            f"\nTRADITIONAL SOURCE:\n{record.get('traditional_source', 'Not specified')}",
        ]

        formatted_text = "\n".join(text_parts)

        return {
            'text': formatted_text,
            'metadata': {
                'source': 'TKDL Database',
                'tkdl_id': record.get('id', 'Unknown'),
                'formulation': record.get('formulation_name', 'Unknown'),
                'system': record.get('system', 'Unknown'),
                'category': record.get('category', 'Herbal Preparation'),
                'keywords': record.get('keywords', ''),
                'indexed_date': record.get('indexed_date', datetime.now().isoformat()),
            }
        }

    def process_tkdl_file(self, file_path: str, format_type: str = 'json') -> List[Dict]:
        """
        Process TKDL data file (JSON or CSV format)
        Returns list of formatted chunks for ingestion
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            return []

        formatted_chunks = []

        try:
            if format_type.lower() == 'json':
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Handle both list and dict formats
                records = data if isinstance(data, list) else [data]

                for record in records:
                    formatted = self.format_tkdl_record(record)
                    formatted_chunks.append(formatted)

            elif format_type.lower() == 'csv':
                import csv
                with open(file_path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        formatted = self.format_tkdl_record(row)
                        formatted_chunks.append(formatted)

            logger.info(f"Processed {len(formatted_chunks)} records from {file_path}")

        except Exception as e:
            logger.error(f"Error processing file: {str(e)}")

        return formatted_chunks

    # ============================================================================
    # 4. METADATA MANAGEMENT
    # ============================================================================

    def create_metadata_index(self, records: List[Dict]) -> Dict:
        """Create metadata index for efficient filtering"""
        metadata_index = {
            'total_records': len(records),
            'systems': {},
            'categories': {},
            'indexed_date': datetime.now().isoformat(),
            'record_sample': records[:3] if records else []
        }

        # Count by system
        for record in records:
            system = record.get('metadata', {}).get('system', 'Unknown')
            metadata_index['systems'][system] = metadata_index['systems'].get(system, 0) + 1

            category = record.get('metadata', {}).get('category', 'Unknown')
            metadata_index['categories'][category] = metadata_index['categories'].get(category, 0) + 1

        return metadata_index

    def save_metadata_index(self, metadata: Dict) -> Path:
        """Save metadata index to file"""
        output_file = self.metadata_dir / "tkdl_metadata_index.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved metadata index to {output_file}")
        return output_file

    # ============================================================================
    # 5. INTEGRATION WITH RAG ENGINE
    # ============================================================================

    def export_for_rag_ingestion(self, formatted_chunks: List[Dict], 
                                 output_file: str = None) -> Path:
        """
        Export formatted chunks in RAG-compatible format
        """
        if not output_file:
            output_file = self.processed_dir / f"tkdl_rag_chunks_{len(formatted_chunks)}.json"
        else:
            output_file = Path(output_file)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(formatted_chunks, f, ensure_ascii=False, indent=2)

        logger.info(f"Exported {len(formatted_chunks)} chunks to {output_file}")
        return output_file

    # ============================================================================
    # 6. STATISTICS AND REPORTING
    # ============================================================================

    def generate_report(self, records: List[Dict]) -> str:
        """Generate report about TKDL data"""
        if not records:
            return "No records to report"

        report = f"""
╔══════════════════════════════════════════════════════════════╗
║            TKDL DATA INGESTION REPORT                        ║
╚══════════════════════════════════════════════════════════════╝

Total Records Processed: {len(records)}
Processing Date: {datetime.now().isoformat()}

Systems Represented:
"""
        systems = {}
        for record in records:
            system = record.get('metadata', {}).get('system', 'Unknown')
            systems[system] = systems.get(system, 0) + 1

        for system, count in systems.items():
            report += f"  • {system}: {count} records\n"

        categories = {}
        for record in records:
            category = record.get('metadata', {}).get('category', 'Unknown')
            categories[category] = categories.get(category, 0) + 1

        report += f"\nCategories:\n"
        for category, count in categories.items():
            report += f"  • {category}: {count} records\n"

        avg_chunk_size = sum(len(r.get('text', '')) for r in records) / len(records) if records else 0
        report += f"\nAverage Chunk Size: {int(avg_chunk_size)} characters\n"

        total_chars = sum(len(r.get('text', '')) for r in records)
        report += f"Total Text Size: {total_chars:,} characters (~{total_chars/1_000_000:.1f} MB)\n"

        report += "\n" + "="*60 + "\n"

        return report


def main():
    """Demo TKDL Manager"""
    manager = TKDLDataManager()

    # Show available sources
    manager.display_tkdl_sources()

    # Generate sample data
    print("\nGenerating sample TKDL data (100 records)...")
    sample_file = manager.save_sample_data(100)

    # Process the data
    print("\nProcessing TKDL data...")
    formatted_chunks = manager.process_tkdl_file(str(sample_file), 'json')

    # Create metadata index
    print("\nCreating metadata index...")
    metadata = manager.create_metadata_index(formatted_chunks)
    manager.save_metadata_index(metadata)

    # Export for RAG
    print("\nExporting for RAG ingestion...")
    rag_file = manager.export_for_rag_ingestion(formatted_chunks)

    # Generate report
    print(manager.generate_report(formatted_chunks))

    print(f"\n✓ Ready to ingest: {rag_file}")


if __name__ == "__main__":
    main()
