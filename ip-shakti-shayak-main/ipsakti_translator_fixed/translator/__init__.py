"""
IP-SAKTI Sahayak — Unified Translator Package

Standalone translation & Indic language processing module:
  - Supports 7 Indian Languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada) + Sanskrit + English
  - Exact domain dictionary for Ayurveda & Intellectual Property (Patents, TKDL, Prior Art)
  - Multi-engine neural translation (deep-translator, googletrans) with automatic retry
  - Automatic language and script detection
"""

from translator.models import Language, LANGUAGE_NAMES, TranslationResult
from translator.dictionary import DomainDictionary, AYURVEDA_TERMS, IP_TERMS, GOVT_TERMS
from translator.detector import LanguageDetector, DetectionResult
from translator.engine import TranslationEngine

# Easy alias for quick usage
Translator = TranslationEngine

__all__ = [
    "Translator",
    "TranslationEngine",
    "LanguageDetector",
    "DomainDictionary",
    "TranslationResult",
    "DetectionResult",
    "Language",
    "LANGUAGE_NAMES",
    "AYURVEDA_TERMS",
    "IP_TERMS",
    "GOVT_TERMS",
]
