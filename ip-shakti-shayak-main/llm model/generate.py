import os
import re
import time
import logging
from dotenv import load_dotenv
from google import genai
from google.genai.models import Models
from rag_client import get_chunks_safe

# Configure logging so callers can see what's happening
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("generate")

# Suppress internal Google SDK warnings
Models._logged_afc_warning = True

# Load GOOGLE_API_KEY from .env file. The google-genai SDK looks for
# GOOGLE_API_KEY in the environment, but we also accept GEMINI_API_KEY
# (which is what the RAG service uses) for consistency.
load_dotenv()
if not os.getenv("GOOGLE_API_KEY") and os.getenv("GEMINI_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]
client = genai.Client()


def build_prompt(query, chunks):
    """Turn retrieved chunks into a numbered source list + instructions for Gemini."""
    context_block = "\n\n".join(
        f"[{i+1}] Source: {c['source']} - {c['document']}\n{c['text']}"
        for i, c in enumerate(chunks)
    )

    instructions = """You are IP-SAKTI Sahayak, an assistant for Ayurveda IP and regulatory guidance.

RULES:
1. Answer ONLY using the numbered source documents below. Never use outside knowledge.
2. Every factual claim must end with a citation like [1] or [1][3].
3. If the documents don't contain enough information, say so explicitly - do not guess.
4. Respond in the same language the user asked in.
"""

    full_prompt = f"""{instructions}

Sources:
{context_block}

Question: {query}

Answer with inline citations [n] for every claim."""

    return full_prompt


def generate_answer(query, chunks):
    """Send prompt to Gemini with automatic retry if Google's server is busy."""
    prompt = build_prompt(query, chunks)
    # Real Gemini model names. As of late 2025/2026 the public Gemini API
    # requires "gemini-3.6-flash" — the previous "gemini-2.5-flash" and
    # "gemini-2.0-flash" both return 404 with a message pointing at 3.6.
    # We try 3.6 first, then a couple of fallbacks in case the API changes.
    models_to_try = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-flash-latest"]

    for model_name in models_to_try:
        for attempt in range(2):
            try:
                logger.info("Calling Gemini model=%s attempt=%d", model_name, attempt + 1)
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                if response and response.text:
                    return response.text
                logger.warning("Gemini returned empty text for model=%s", model_name)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Gemini call failed (model=%s attempt=%d): %s",
                               model_name, attempt + 1, exc)
                time.sleep(1)

    return ("I could not reach the Gemini service to generate a grounded answer. "
            "The retrieved sources are listed below for your reference.")


def extract_references(answer_text, chunks):
    """Find which [n] citations Gemini actually used, and map them back to sources."""
    cited_numbers = set(int(n) for n in re.findall(r'\[(\d+)\]', answer_text))

    references = {}
    for i, c in enumerate(chunks):
        n = i + 1
        if n in cited_numbers:
            references[n] = {
                "document": c["document"],
                "source": c["source"],
                "url": c["url"]
            }
    return references


def answer_query(query, top_k=5):
    """Full pipeline: retrieve -> generate -> validate citations."""
    chunks = get_chunks_safe(query, top_k=top_k)

    if not chunks:
        return {
            "answer": "I couldn't find any documentation to answer this.",
            "references": {},
            "chunks": []
        }

    answer_text = generate_answer(query, chunks)
    references = extract_references(answer_text, chunks)

    return {
        "answer": answer_text,
        "references": references,
        "chunks": chunks,  # expose so the orchestrator can build a full RagResponse
    }


# ---- Run this file directly to test ----
if __name__ == "__main__":
    test_query = "Is there a patent on turmeric?"
    result = answer_query(test_query)

    print("\n--- ANSWER ---")
    print(result["answer"])

    print("\n--- REFERENCES ---")
    for num, ref in result["references"].items():
        print(f"[{num}] {ref['document']} ({ref['source']}) - {ref['url']}")
