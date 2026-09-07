# rag_client.py
# Real RAG client — replaces mock_data.py. Calls the live RAG service
# (ip-sakti-rag) over HTTP and normalizes the response into the chunk shape
# that generate.py expects.
#
# Expected chunk shape (one dict per item):
#   { "text": str, "source": str, "document": str, "url": str, "score": float,
#     "chunk_id": str }

import os
import logging
from typing import List, Dict, Any

import requests

logger = logging.getLogger(__name__)

# Default points at the local RAG service. Override with RAG_SERVICE_URL env var
# when deploying (e.g. http://rag-host:8001).
RAG_SERVICE_URL = os.getenv("RAG_SERVICE_URL", "http://localhost:8001").rstrip("/")
RETRIEVE_ENDPOINT = f"{RAG_SERVICE_URL}/retrieve"
DEFAULT_TIMEOUT = 30
DEFAULT_TOP_K = 5


def _coerce_chunk(doc: Dict[str, Any], index: int) -> Dict[str, Any]:
    """
    Map a raw document from the RAG service into the flat shape generate.py
    expects. The RAG service returns {text, metadata, distance, relevance_score};
    we need {text, source, document, url, score, chunk_id}.
    """
    metadata = doc.get("metadata") or {}

    # `document` is the most useful label: the section name from the Ayurveda KB.
    document = (
        metadata.get("title")
        or metadata.get("section")
        or metadata.get("knowledge_base")
        or "Ayurveda reference"
    )

    # `source` is the file/database name the chunk came from.
    source = (
        metadata.get("source")
        or metadata.get("knowledge_base")
        or "Ayurveda knowledge base"
    )

    # We don't have a real URL for these chunks; synthesize a stable citation id
    # that the UI can render as a citation marker.
    section = metadata.get("section") or "section"
    chunk_number = metadata.get("chunk_number") or index
    chunk_id = f"{source}::{section}::chunk-{chunk_number}"
    url = f"rag://{source}#{chunk_number}"

    return {
        "chunk_id": chunk_id,
        "text": doc.get("text", ""),
        "source": source,
        "document": document,
        "url": url,
        "score": float(doc.get("relevance_score", 0.0) or 0.0),
        "metadata": metadata,  # kept for orchestrator-side enrichment
    }


def get_chunks(query: str, top_k: int = DEFAULT_TOP_K) -> List[Dict[str, Any]]:
    """
    Call the live RAG service to retrieve the top-k chunks for a query.

    Returns a list of normalized chunk dicts. Raises requests.RequestException
    on network failure so the orchestrator can decide how to degrade.
    """
    if not query or not query.strip():
        return []

    payload = {"query": query, "top_k": top_k}
    logger.info("Calling RAG retrieve: %s with top_k=%d", RETRIEVE_ENDPOINT, top_k)

    try:
        resp = requests.post(RETRIEVE_ENDPOINT, json=payload, timeout=DEFAULT_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as exc:
        logger.error("RAG retrieve failed: %s", exc)
        raise

    data = resp.json()
    documents = data.get("documents", []) if isinstance(data, dict) else []
    if not isinstance(documents, list):
        logger.warning("Unexpected RAG response shape: %r", type(data))
        return []

    return [_coerce_chunk(doc, i) for i, doc in enumerate(documents)]


def get_chunks_safe(query: str, top_k: int = DEFAULT_TOP_K) -> List[Dict[str, Any]]:
    """
    Same as get_chunks but returns [] instead of raising. Useful as a last
    resort so the orchestrator can still produce a response.
    """
    try:
        return get_chunks(query, top_k=top_k)
    except Exception as exc:  # noqa: BLE001
        logger.error("RAG client returning empty list due to: %s", exc)
        return []


# Backwards-compat alias so existing `from mock_data import get_mock_chunks`
# style imports keep working if any caller still uses that name.
def get_mock_chunks(query: str) -> List[Dict[str, Any]]:
    return get_chunks_safe(query)
