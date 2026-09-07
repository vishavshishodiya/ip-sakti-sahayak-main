from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import uvicorn
from pathlib import Path
import tempfile

from rag_engine import RAGEngine
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="IP-SAKTI Sahayak RAG API",
    description="RAG-based AI Assistant for Ayurveda IP and Regulatory Guidance",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG engine
rag = RAGEngine()

# Pydantic models
class QueryRequest(BaseModel):
    query: str = Field(..., description="User query")
    top_k: Optional[int] = Field(5, description="Number of documents to retrieve")

class QueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[Dict]
    confidence: float
    num_sources: int

class IngestResponse(BaseModel):
    status: str
    chunks_added: int
    file_path: str

class StatsResponse(BaseModel):
    collection_name: str
    document_count: int
    embedding_model: str


# API Endpoints
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {
        "message": "IP-SAKTI Sahayak RAG API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/stats", response_model=StatsResponse, tags=["System"])
async def get_stats():
    """Get RAG system statistics"""
    try:
        stats = rag.get_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest", response_model=IngestResponse, tags=["Document Management"])
async def ingest_document(file_path: str):
    """Ingest a markdown document into the RAG system"""
    try:
        if not Path(file_path).exists():
            raise HTTPException(status_code=404, detail="File not found")

        result = rag.ingest_document(file_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest/upload", response_model=IngestResponse, tags=["Document Management"])
async def upload_and_ingest(file: UploadFile = File(...)):
    """Upload and ingest a markdown document"""
    try:
        if not file.filename.endswith('.md'):
            raise HTTPException(status_code=400, detail="Only markdown (.md) files are supported")

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.md') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        # Ingest the document
        result = rag.ingest_document(tmp_path)
        result['file_path'] = file.filename

        # Clean up temp file
        Path(tmp_path).unlink()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse, tags=["RAG"])
async def query_rag(request: QueryRequest):
    """Query the RAG system"""
    try:
        result = rag.query(request.query, request.top_k)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/retrieve", tags=["RAG"])
async def retrieve_documents(request: QueryRequest):
    """Retrieve relevant documents without generation"""
    try:
        docs = rag.retrieve(request.query, request.top_k)
        return {
            "query": request.query,
            "documents": docs,
            "num_retrieved": len(docs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear", tags=["System"])
async def clear_collection():
    """Clear all documents from the vector store"""
    try:
        rag.vector_store.clear_collection()
        return {"status": "success", "message": "Collection cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
