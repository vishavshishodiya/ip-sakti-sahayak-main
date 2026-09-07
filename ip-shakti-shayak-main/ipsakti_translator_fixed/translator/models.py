"""
Data Models for Translation Engine
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Optional


class Language(str, Enum):
    """Supported languages in IP-SAKTI Sahayak."""
    ENGLISH = "en"
    HINDI = "hi"
    SANSKRIT = "sa"
    BENGALI = "bn"
    TAMIL = "ta"
    TELUGU = "te"
    MARATHI = "mr"
    GUJARATI = "gu"
    KANNADA = "kn"


LANGUAGE_NAMES: Dict[str, str] = {
    "en": "English",
    "hi": "Hindi",
    "sa": "Sanskrit",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "mr": "Marathi",
    "gu": "Gujarati",
    "kn": "Kannada",
}


@dataclass
class TranslationResult:
    """Result of a translation operation."""
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    confidence: float = 1.0
    backend: str = "unknown"
    fallback_used: bool = False
    domain_terms_found: list = field(default_factory=list)

    @property
    def source_language_name(self) -> str:
        return LANGUAGE_NAMES.get(self.source_lang, self.source_lang)

    @property
    def target_language_name(self) -> str:
        return LANGUAGE_NAMES.get(self.target_lang, self.target_lang)

    def to_dict(self) -> dict:
        return {
            "source_text": self.source_text,
            "translated_text": self.translated_text,
            "source_lang": self.source_lang,
            "target_lang": self.target_lang,
            "source_language_name": self.source_language_name,
            "target_language_name": self.target_language_name,
            "confidence": self.confidence,
            "backend": self.backend,
            "fallback_used": self.fallback_used,
            "domain_terms_found": self.domain_terms_found,
        }
