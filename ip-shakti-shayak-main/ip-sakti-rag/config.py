from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys (optional)
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None  # Used by rag_engine for answer generation

    # Vector DB Settings (FAISS)
    faiss_data_directory: str = "./faiss_data"
    collection_name: str = "ip_sakti_docs"

    # Embedding Model
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Retrieval Settings
    # Lowered from 0.5 to 0.2: with L2 distances on MiniLM, the 1/(1+distance)
    # score rarely clears 0.5 for genuinely relevant chunks. 0.2 is permissive
    # enough to return hits for live demo queries while still filtering noise.
    top_k: int = 5
    similarity_threshold: float = 0.2

    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8001

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
