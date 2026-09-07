from typing import List, Dict, Optional
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from config import settings
import json
import pickle
from pathlib import Path


class VectorStore:
    """Manages vector embeddings and similarity search using FAISS"""

    def __init__(self):
        # Initialize embedding model
        self.embedding_model = SentenceTransformer(settings.embedding_model)
        self.embedding_dim = self.embedding_model.get_sentence_embedding_dimension()

        # Initialize FAISS index
        self.index = faiss.IndexFlatL2(self.embedding_dim)

        # Store document metadata
        self.documents = []
        self.metadata = []

        # Load existing data if available
        self.data_dir = Path(settings.faiss_data_directory)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._load_index()

    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding vector for text"""
        return self.embedding_model.encode(text, convert_to_numpy=True)

    def add_documents(self, documents: List[Dict]) -> int:
        """Add documents to vector store"""
        texts = [doc['text'] for doc in documents]
        metadatas = [doc['metadata'] for doc in documents]

        # Generate embeddings
        embeddings = self.embedding_model.encode(texts, convert_to_numpy=True)

        # Add to FAISS index
        self.index.add(embeddings.astype('float32'))

        # Store documents and metadata
        self.documents.extend(texts)
        self.metadata.extend(metadatas)

        # Save index
        self._save_index()

        return len(documents)

    def search(
        self,
        query: str,
        top_k: Optional[int] = None,
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """Search for similar documents"""
        if top_k is None:
            top_k = settings.top_k

        # Check if index has documents
        if self.index.ntotal == 0:
            return []

        # Generate query embedding
        query_embedding = self.generate_embedding(query).reshape(1, -1).astype('float32')

        # Search in FAISS index
        distances, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))

        # Format results
        formatted_results = []
        for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
            if idx < len(self.documents):
                # Convert L2 distance to similarity score (0-1)
                similarity_score = 1 / (1 + distance)

                result = {
                    "text": self.documents[idx],
                    "metadata": self.metadata[idx],
                    "distance": float(distance),
                    "relevance_score": float(similarity_score)
                }

                # Apply filters if provided
                if filters:
                    match = True
                    for key, value in filters.items():
                        if key not in result['metadata'] or result['metadata'][key] != value:
                            match = False
                            break
                    if not match:
                        continue

                # Apply similarity threshold
                if similarity_score >= settings.similarity_threshold:
                    formatted_results.append(result)

        return formatted_results

    def get_collection_stats(self) -> Dict:
        """Get statistics about the collection"""
        return {
            "collection_name": settings.collection_name,
            "document_count": self.index.ntotal,
            "embedding_model": settings.embedding_model
        }

    def clear_collection(self):
        """Clear all documents from collection"""
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        self.documents = []
        self.metadata = []
        self._save_index()

    def _save_index(self):
        """Save FAISS index and metadata to disk"""
        index_path = self.data_dir / "faiss_index.bin"
        docs_path = self.data_dir / "documents.pkl"
        meta_path = self.data_dir / "metadata.json"

        # Save FAISS index
        faiss.write_index(self.index, str(index_path))

        # Save documents
        with open(docs_path, 'wb') as f:
            pickle.dump(self.documents, f)

        # Save metadata
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)

    def _load_index(self):
        """Load FAISS index and metadata from disk"""
        index_path = self.data_dir / "faiss_index.bin"
        docs_path = self.data_dir / "documents.pkl"
        meta_path = self.data_dir / "metadata.json"

        if index_path.exists() and docs_path.exists() and meta_path.exists():
            try:
                # Load FAISS index
                self.index = faiss.read_index(str(index_path))

                # Load documents
                with open(docs_path, 'rb') as f:
                    self.documents = pickle.load(f)

                # Load metadata
                with open(meta_path, 'r', encoding='utf-8') as f:
                    self.metadata = json.load(f)

            except Exception as e:
                print(f"Warning: Could not load existing index: {e}")
                self.index = faiss.IndexFlatL2(self.embedding_dim)
                self.documents = []
                self.metadata = []
