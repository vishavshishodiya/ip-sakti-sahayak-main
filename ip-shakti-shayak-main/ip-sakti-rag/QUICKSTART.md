# Production RAG System - Quick Reference

## 🚀 Getting Started (3 Simple Steps)

### Step 1: Activate Environment
```bash
cd "C:\Users\Anshul Yadav\ip-sakti-rag"
.\venv\Scripts\activate
```

### Step 2: Build Knowledge Base
```bash
python build_knowledge_base.py
```

### Step 3: Start Using!
```bash
# Interactive mode
python cli.py interactive

# Or start API
python api.py
# Visit: http://localhost:8000/docs

# Or run demo
python demo.py
```

## 📝 Common Commands

### Query the RAG
```bash
# Single query
python cli.py query "What are the project objectives?"

# Interactive mode
python cli.py interactive

# View statistics
python cli.py stats
```

### Add More Documents
```bash
# Ingest a file
python cli.py ingest path/to/document.md

# Ingest directory
# 1. Create ./data/ folder
# 2. Add markdown files
# 3. Run build script
python build_knowledge_base.py
```

### Web Scraping
```bash
# Run web scraper
python web_scraper.py

# Edit build_knowledge_base.py and uncomment scraping section
# Then run:
python build_knowledge_base.py
```

### Start API Server
```bash
python api.py
# API docs: http://localhost:8000/docs
```

## 🔧 Configuration

Edit `config.py`:
- `top_k`: Number of results (default: 5)
- `similarity_threshold`: Minimum relevance (default: 0.3)
- `embedding_model`: Change embedding model

## 🎯 Key Features

✅ **Semantic Search** - Find relevant info even with different wording  
✅ **Source Citations** - Every answer includes sources with confidence  
✅ **Web Scraping** - Scrape TKDL, AYUSH, patent websites  
✅ **REST API** - FastAPI with Swagger UI  
✅ **Offline** - Works without internet after setup  
✅ **Claude API** - Optional integration for better answers  

## 📊 System Info

- **Vector DB**: FAISS
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Storage**: `./faiss_data/`
- **Scraped Data**: `./scraped_data/`

## 🔑 Add Claude API (Optional)

For better answers:
```bash
# Install
pip install anthropic

# Add API key (Windows)
set ANTHROPIC_API_KEY=your_key_here

# Or in .env file
echo ANTHROPIC_API_KEY=your_key_here >> .env

# Use automatically
python cli.py interactive
# Will detect API key and use Claude
```

## 📁 File Structure

```
Main Scripts:
├── build_knowledge_base.py   # Build database (non-interactive)
├── cli.py                     # Command-line interface
├── api.py                     # REST API server
└── demo.py                    # Demo queries

Core System:
├── rag_engine.py              # RAG logic
├── vector_store.py            # FAISS database
├── document_processor.py      # Document parsing
└── config.py                  # Settings

Data Ingestion:
├── web_scraper.py             # Web scraping
└── ingestion_pipeline.py      # Multi-source ingestion

Data:
├── faiss_data/                # Vector database
├── scraped_data/              # Web content
└── data/                      # Your documents (create this)
```

## 🐛 Troubleshooting

**Error: Module not found**
```bash
.\venv\Scripts\activate  # Activate environment first
```

**Error: File not found**
- Update paths in scripts
- Check file exists

**Slow first query**
- Model downloads first time (~80MB)
- Subsequent queries are fast

**Want to reset database**
```python
from rag_engine import RAGEngine
rag = RAGEngine()
rag.clear_database()
```

## 📚 Full Documentation

See `README.md` for complete documentation including:
- Architecture details
- API endpoints
- Web scraping guide
- Production deployment
- Claude API integration
- Docker deployment

---

**Quick Start**: `python build_knowledge_base.py`  
**Interactive**: `python cli.py interactive`  
**API Server**: `python api.py`
