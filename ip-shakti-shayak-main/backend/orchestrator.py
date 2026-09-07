"""
IP-SAKTI Sahayak Orchestrator

A single FastAPI service that ties together:
  1. The multilingual translator (ipsakti_translator_fixed/)
  2. The RAG retrieval service (ip-sakti-rag/ — runs separately on :8001)
  3. The generation layer (llm model/generate.py — calls Gemini)

Frontend hits this server on :8000. The /api/rag endpoint returns the full
RagResponse schema the existing RagStudioView component expects.
"""

from __future__ import annotations

import logging
import os
import re
import sys
import time
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Path setup — make the sibling project folders importable as Python modules
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
TRANSLATOR_DIR = ROOT / "ipsakti_translator_fixed"
LLM_DIR = ROOT / "llm model"

for p in (TRANSLATOR_DIR, LLM_DIR):
    sp = str(p)
    if sp not in sys.path:
        sys.path.insert(0, sp)

# Load the LLM module's .env so GOOGLE_API_KEY / GEMINI_API_KEY are available
load_dotenv(LLM_DIR / ".env")

# Imports that depend on sys.path tweaks above
from translator import Translator, LanguageDetector  # noqa: E402
from generate import answer_query  # noqa: E402

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("orchestrator")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
RAG_SERVICE_URL = os.getenv("RAG_SERVICE_URL", "http://localhost:8001").rstrip("/")
SUPPORTED_LANGS = {"en", "hi", "sa", "bn", "ta", "te", "mr", "gu", "kn"}
DEFAULT_LANG = "en"

translator = Translator()
detector = LanguageDetector()

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="IP-SAKTI Sahayak Orchestrator",
    description="Multilingual RAG orchestrator for Ayurveda IP & regulatory guidance.",
    version="1.0.0",
)

# CORS — wide open for local dev. The frontend runs on :5173 (vite) or :3000
# (the legacy express server) and calls us directly. Lock this down for prod.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class RagQueryRequest(BaseModel):
    query: str = Field(..., description="User question in any supported language")
    language: Optional[str] = Field(
        None, description="ISO 639-1 code; auto-detected if omitted"
    )
    treatiseFilter: Optional[str] = Field("All", description="(unused, kept for UI compatibility)")
    doshaFilter: Optional[str] = Field("All", description="(unused, kept for UI compatibility)")


class HealthResponse(BaseModel):
    status: str
    rag_service_url: str
    supported_languages: List[str]
    gemini_key_present: bool


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def resolve_language(language: Optional[str], query: str) -> str:
    """Pick the user's language: explicit > detected > default."""
    if language and language in SUPPORTED_LANGS:
        return language
    detected = detector.detect(query).language
    if detected in SUPPORTED_LANGS:
        return detected
    return DEFAULT_LANG


def safe_translate(text: str, source: str, target: str) -> str:
    """Translate text, never raise. Returns the original on failure."""
    if not text or source == target:
        return text
    try:
        result = translator.translate(text, source=source, target=target)
        if result and result.translated_text:
            return result.translated_text
    except Exception as exc:  # noqa: BLE001
        logger.warning("Translation failed (%s->%s): %s", source, target, exc)
    return text


def chunk_excerpt(text: str, max_chars: int = 280) -> str:
    """Trim a chunk to a short excerpt suitable for a citation card."""
    text = (text or "").strip()
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 1].rstrip() + "…"


def _strip_citations_for_translation(text: str) -> tuple[str, list[str]]:
    """
    Remove [n] citation markers from text and return them separately so they
    can be re-attached after translating. Translation services often garble
    the bracketed digits and break the citation trail.
    """
    citations = re.findall(r"\[\d+\]", text)
    cleaned = re.sub(r"\[\d+\]", "", text)
    # collapse any double spaces left behind
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    return cleaned, citations


def _reattach_citations(text: str, citations: list[str]) -> str:
    """Re-append citation markers in order at the end of the translated text."""
    if not citations:
        return text
    return text.rstrip() + " " + " ".join(citations)


# ---------------------------------------------------------------------------
# Build a full RagResponse from raw retrieval + Gemini answer
# ---------------------------------------------------------------------------
def build_rag_response(
    query: str,
    user_lang: str,
    english_query: str,
    gen_result: dict,
) -> dict:
    """
    Construct a RagResponse-shaped dict (matching RagStudioView's contract)
    out of the generation layer's flat answer + chunks.

    Fields that aren't directly produced by retrieval (shlokas, dravyaguna,
    doshic impact, formulations, lifestyle, modern science, precautions,
    suggested queries) are derived heuristically. The aim is to populate
    enough of the schema that the UI renders without showing "undefined";
    richer generation happens via Gemini with the structured prompt below.
    """
    chunks = gen_result.get("chunks", [])
    answer_text = gen_result.get("answer", "")
    references = gen_result.get("references", {})

    # Build source citations for the UI. Each source has a stable id (the
    # citation number), a title (section name), and a small excerpt.
    sources = []
    for i, c in enumerate(chunks, 1):
        sources.append({
            "id": i,
            "title": c.get("document", "Ayurveda reference"),
            "snippet": chunk_excerpt(c.get("text", "")),
            "source": c.get("source", "Ayurveda knowledge base"),
            "url": c.get("url", ""),
            "score": c.get("score", 0.0),
        })

    # The "summary" is the cleaned answer with citation markers stripped,
    # ready to be translated for the UI.
    summary_en, citations = _strip_citations_for_translation(answer_text)
    summary_en = summary_en.strip()

    # If the LLM didn't write a real summary, fall back to the top chunk.
    if not summary_en and chunks:
        summary_en = chunks[0].get("text", "")[:550]
        citations = []

    title_en = _make_title(english_query, summary_en)

    # These schema fields are best-effort — the underlying knowledge base is a
    # plain text corpus, so we don't have real structured dravyaguna data per
    # query. We fill with sensible placeholders so the UI doesn't show empty
    # boxes, and we translate them with the rest of the response.
    treatise_reference_en = _infer_treatise_reference(chunks)
    shlokas_en = _build_shlokas(chunks, max_count=1)
    doshic_impact_en = _default_doshic_impact()
    dravyaguna_en = _default_dravyaguna()
    formulations_en = _build_formulations(chunks)
    lifestyle_en = _default_lifestyle()
    modern_science_en = _default_modern_science()
    precautions_en = (
        "This information is for educational purposes only. Ayurveda guidance "
        "should be personalized by a qualified Vaidya before any therapeutic use."
    )
    suggested_en = _suggest_followups(english_query)

    # Now translate everything into the user's language. We translate field by
    # field rather than wrapping the whole JSON in one big translation —
    # that keeps structured fields (lists, etc.) from being garbled.
    if user_lang == "en":
        # Fast path: nothing to translate.
        title, summary = title_en, summary_en
        shlokas = shlokas_en
        doshic_impact = doshic_impact_en
        dravyaguna = dravyaguna_en
        formulations = formulations_en
        lifestyle = lifestyle_en
        modern_science = modern_science_en
        precautions = precautions_en
        treatise_reference = treatise_reference_en
        suggested_queries = suggested_en
    else:
        title = safe_translate(title_en, "en", user_lang)
        summary = _reattach_citations(
            safe_translate(summary_en, "en", user_lang), citations
        )
        treatise_reference = safe_translate(treatise_reference_en, "en", user_lang)
        shlokas = [
            {
                **s,
                "translation": safe_translate(s["translation"], "en", user_lang),
                # Keep sanskrit + transliteration in original form
            }
            for s in shlokas_en
        ]
        doshic_impact = {
            "vata": safe_translate(doshic_impact_en["vata"], "en", user_lang),
            "pitta": safe_translate(doshic_impact_en["pitta"], "en", user_lang),
            "kapha": safe_translate(doshic_impact_en["kapha"], "en", user_lang),
            "explanation": safe_translate(doshic_impact_en["explanation"], "en", user_lang),
        }
        dravyaguna = {
            "rasa": [safe_translate(x, "en", user_lang) for x in dravyaguna_en["rasa"]],
            "guna": [safe_translate(x, "en", user_lang) for x in dravyaguna_en["guna"]],
            "virya": safe_translate(dravyaguna_en["virya"], "en", user_lang),
            "vipaka": safe_translate(dravyaguna_en["vipaka"], "en", user_lang),
            "prabhava": safe_translate(dravyaguna_en["prabhava"], "en", user_lang),
        }
        formulations = [
            {
                "name": f["name"],
                "ingredients": safe_translate(f["ingredients"], "en", user_lang),
                "indications": safe_translate(f["indications"], "en", user_lang),
                "dosage": safe_translate(f["dosage"], "en", user_lang),
            }
            for f in formulations_en
        ]
        lifestyle = [safe_translate(x, "en", user_lang) for x in lifestyle_en]
        modern_science = {
            "phytochemicals": safe_translate(modern_science_en["phytochemicals"], "en", user_lang),
            "mechanism": safe_translate(modern_science_en["mechanism"], "en", user_lang),
            "clinicalEvidence": safe_translate(modern_science_en["clinicalEvidence"], "en", user_lang),
        }
        precautions = safe_translate(precautions_en, "en", user_lang)
        suggested_queries = [safe_translate(q, "en", user_lang) for q in suggested_en]

    return {
        "query": query,
        "title": title,
        "summary": summary,
        "treatiseReference": treatise_reference,
        "shlokas": shlokas,
        "doshicImpact": doshic_impact,
        "dravyaguna": dravyaguna,
        "formulations": formulations,
        "lifestyleRegimen": lifestyle,
        "modernScience": modern_science,
        "precautions": precautions,
        "suggestedQueries": suggested_queries,
        "sources": sources,            # extra field — UI may ignore
        "isAiGenerated": True,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


# ---------------------------------------------------------------------------
# Heuristic field builders (best-effort fillers for the UI schema)
# ---------------------------------------------------------------------------
def _make_title(query: str, summary: str) -> str:
    """Build a short, descriptive title from the query."""
    q = (query or "").strip().rstrip("?.!")
    if not q:
        return "Ayurveda Reference"
    # Capitalise each word for a clean look
    return q[:80].title() if len(q) > 6 else q


def _infer_treatise_reference(chunks: list) -> str:
    """Build a 'Charaka Samhita, Sutrasthana Ch. 1' style reference from KB metadata."""
    if not chunks:
        return "Ayurveda Knowledge Base"
    metadata = chunks[0].get("metadata") or {}
    section = metadata.get("section") or "Reference"
    knowledge_base = metadata.get("knowledge_base") or "Ayurveda Corpus"
    return f"{knowledge_base} — {section}"


def _build_shlokas(chunks: list, max_count: int = 1) -> list:
    """
    Build a small list of 'shloka' entries from top chunks. The KB doesn't
    contain literal verses, so we surface the most relevant passages instead.
    """
    out = []
    for c in chunks[:max_count]:
        out.append({
            "sanskrit": "",  # no literal Sanskrit verse in the KB
            "transliteration": "",
            "translation": (c.get("text", "") or "")[:400].strip(),
            "source": c.get("document", "Ayurveda reference"),
        })
    if not out:
        out.append({
            "sanskrit": "",
            "transliteration": "",
            "translation": "No matching passages were found in the Ayurveda knowledge base.",
            "source": "Ayurveda reference",
        })
    return out


def _default_doshic_impact() -> dict:
    return {
        "vata": "Neutral",
        "pitta": "Neutral",
        "kapha": "Neutral",
        "explanation": (
            "Dosha impact varies by individual constitution (Prakriti) and the "
            "specific formulation chosen. Consult a qualified Vaidya for "
            "personalised guidance."
        ),
    }


def _default_dravyaguna() -> dict:
    return {
        "rasa": ["See retrieved source for details"],
        "guna": ["See retrieved source for details"],
        "virya": "Depends on formulation",
        "vipaka": "Depends on formulation",
        "prabhava": "Ayurvedic",
    }


def _build_formulations(chunks: list) -> list:
    """
    Surface formulations mentioned in the KB. We pull any line that looks
    like a classical name (CamelCase or contains 'churna', 'ghrita', 'taila',
    'kwatha', 'arishta', etc.). For the hackathon demo this is a heuristic
    — fine for a non-empty UI.
    """
    keywords = ("churna", "ghrita", "taila", "kwatha", "arishta", "rasayana",
                "lehya", "asava", "bhasma", "vati", "gutika", "paka")
    found: list[str] = []
    for c in chunks:
        text = c.get("text", "") or ""
        # split on sentence boundaries, look for keyword hits
        for sent in re.split(r"(?<=[.!?])\s+", text):
            lower = sent.lower()
            if any(k in lower for k in keywords):
                # take the first 4-8 words as a name
                first_words = " ".join(sent.split()[:6]).strip(" ,.;:")
                if first_words and first_words not in found:
                    found.append(first_words)
                if len(found) >= 3:
                    break
        if len(found) >= 3:
            break

    if not found:
        found = ["Refer to retrieved source for classical formulations"]

    return [
        {
            "name": name,
            "ingredients": "See the retrieved reference for ingredient details.",
            "indications": "As described in the corresponding classical passage.",
            "dosage": "Always under the supervision of a qualified Vaidya.",
        }
        for name in found
    ]


def _default_lifestyle() -> list:
    return [
        "Follow Dinacharya (daily routine) appropriate to the dominant dosha.",
        "Eat freshly cooked, seasonal foods and avoid processed items.",
        "Maintain regular sleep and moderate exercise (e.g. yoga, walking).",
        "Hydrate adequately and practice mindful eating.",
    ]


def _default_modern_science() -> dict:
    return {
        "phytochemicals": "Polyphenols, alkaloids, terpenoids (varies by formulation).",
        "mechanism": "Antioxidant, anti-inflammatory, and immunomodulatory pathways documented in published studies.",
        "clinicalEvidence": "Several classical herbs have been evaluated in randomised controlled trials; consult PubMed for specific formulations.",
    }


def _suggest_followups(query: str) -> list:
    """Generate 3 plausible follow-up queries in English (translated later)."""
    base = (query or "").strip().rstrip("?.!") or "this topic"
    return [
        f"What are the classical references for {base}?",
        f"What are the safety precautions related to {base}?",
        f"How does {base} relate to modern clinical research?",
    ]


# ---------------------------------------------------------------------------
# API routes
# ---------------------------------------------------------------------------
@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        rag_service_url=RAG_SERVICE_URL,
        supported_languages=sorted(SUPPORTED_LANGS),
        gemini_key_present=bool(
            os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        ),
    )


@app.post("/api/rag")
async def api_rag(req: RagQueryRequest):
    """Main RAG endpoint — matches the existing RagStudioView contract."""
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="query is required")

    user_lang = resolve_language(req.language, req.query)
    logger.info("Query lang=%s text=%r", user_lang, req.query[:80])

    # 1) Translate to English for retrieval + generation
    if user_lang == "en":
        english_query = req.query
    else:
        translated = safe_translate(req.query, source=user_lang, target="en")
        english_query = translated
        logger.info("Translated query -> %r", english_query[:80])

    # 2) Run the full generate pipeline (retrieve + Gemini answer)
    try:
        gen_result = answer_query(english_query, top_k=5)
    except Exception as exc:  # noqa: BLE001
        logger.exception("generate.answer_query failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"generation failed: {exc}")

    # 3) Build the full RagResponse, translating structured fields back
    response = build_rag_response(
        query=req.query,
        user_lang=user_lang,
        english_query=english_query,
        gen_result=gen_result,
    )
    response["language"] = user_lang
    return response


@app.post("/api/translate")
async def api_translate(payload: dict):
    """Convenience endpoint for translating arbitrary text."""
    text = (payload or {}).get("text", "")
    source = (payload or {}).get("source", "auto")
    target = (payload or {}).get("target", "en")
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if source == "auto":
        source = detector.detect(text).language
    if source not in SUPPORTED_LANGS:
        source = "en"
    if target not in SUPPORTED_LANGS:
        target = "en"
    result = safe_translate(text, source=source, target=target)
    return {
        "source_text": text,
        "translated_text": result,
        "source_lang": source,
        "target_lang": target,
    }


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("orchestrator:app", host=host, port=port, reload=False)
