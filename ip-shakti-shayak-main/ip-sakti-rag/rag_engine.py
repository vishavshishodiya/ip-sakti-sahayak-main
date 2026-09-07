from typing import Dict, List, Optional
import os

from document_processor import MarkdownProcessor
from vector_store import VectorStore


class RAGEngine:
    """FAISS retrieval plus Gemini-grounded answer generation."""

    def __init__(self):
        self.vector_store = VectorStore()
        self.processor = MarkdownProcessor()
        # Prefer settings.gemini_api_key (loaded from .env) but fall back to
        # the raw env var for backwards compatibility.
        from config import settings
        self.gemini_api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.use_gemini = False

        if self.gemini_api_key:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=self.gemini_api_key)
                self.use_gemini = True
                print("✓ Gemini API enabled for enhanced answers")
            except ImportError:
                print("Gemini key found, but google-genai is not installed.")
                print("Install it with: python -m pip install google-genai")

    def ingest_document(self, file_path: str) -> Dict:
        chunks = self.processor.process_document(file_path)
        return {"status": "success", "chunks_added": self.vector_store.add_documents(chunks), "file_path": file_path}

    def retrieve(self, query: str, top_k: Optional[int] = None, filters: Optional[Dict] = None) -> List[Dict]:
        return self.vector_store.search(query, top_k, filters)

    def generate_answer(self, query: str, retrieved_docs: List[Dict]) -> Dict:
        if not retrieved_docs:
            return {"answer": "I could not find relevant information in the Ayurveda knowledge base for that question.", "sources": [], "confidence": 0.0}

        sources, context_parts = [], []
        for number, document in enumerate(retrieved_docs, 1):
            metadata = document["metadata"]
            context_parts.append(f"[Source {number}]\n{document['text']}")
            sources.append({
                "source_number": number,
                "title": metadata.get("title") or metadata.get("section") or metadata.get("source", "Ayurveda reference"),
                "source": metadata.get("source", "Ayurveda reference"),
                "relevance_score": round(document["relevance_score"], 3),
            })
        context = "\n\n".join(context_parts)
        answer = self._generate_with_gemini(query, context) if self.use_gemini else self._generate_extractive_answer(retrieved_docs, sources)
        confidence = sum(item["relevance_score"] for item in retrieved_docs) / len(retrieved_docs)
        return {"answer": answer, "sources": sources, "confidence": round(confidence, 3), "context": context}

    def _generate_with_gemini(self, query: str, context: str) -> str:
        prompt = f"""You are IP-SAKTI Sahayak, an Ayurveda knowledge-base assistant.
Answer only from the supplied retrieved context. Do not invent facts, formulations, doses, citations, or medical claims. If the context does not answer the question, say so clearly.

Write a clear, helpful answer in plain language. Cite claims as [Source 1], [Source 2], etc. Include a brief safety note that Ayurveda information is educational and not a substitute for qualified medical care when health advice is involved.

Retrieved context:
{context}

Question: {query}
"""
        try:
            response = self.gemini_client.models.generate_content(model="gemini-3.6-flash", contents=prompt)
            if response.text:
                return response.text
            return "Gemini returned no text. Please try the question again."
        except Exception as error:
            print(f"Gemini API error: {error}")
            return "Gemini could not generate an answer. Check the API key, internet connection, and Gemini API quota."

    @staticmethod
    def _generate_extractive_answer(documents: List[Dict], sources: List[Dict]) -> str:
        excerpts = []
        for source, document in zip(sources[:3], documents[:3]):
            excerpts.append(f"{document['text'][:550].strip()} [Source {source['source_number']}]")
        return "\n\n".join(excerpts)

    def query(self, query: str, top_k: Optional[int] = None) -> Dict:
        result = self.generate_answer(query, self.retrieve(query, top_k))
        result.update({"query": query, "num_sources": len(result["sources"]), "method": "gemini" if self.use_gemini else "extractive"})
        return result

    def get_stats(self) -> Dict:
        return self.vector_store.get_collection_stats()

    def clear_database(self):
        self.vector_store.clear_collection()
        print("✓ Database cleared")
