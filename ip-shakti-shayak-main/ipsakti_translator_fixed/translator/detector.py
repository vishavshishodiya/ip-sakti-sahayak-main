"""
Language Detector Module for Translator

Specialized for Indian languages:
  1. High-precision Unicode script detection (Devanagari, Tamil, Telugu, Bengali, Gujarati, Kannada)
  2. Sanskrit detection heuristics (visarga, specific markers)
  3. Mixed script & Romanized Hindi handling
  4. Fallback to langdetect with Indian language preference
"""

import re
import unicodedata
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

from translator.models import LANGUAGE_NAMES, Language


# Unicode block ranges
SCRIPT_UNICODE_RANGES = {
    "Devanagari": (0x0900, 0x097F),  # Hindi, Marathi, Sanskrit
    "Bengali":    (0x0980, 0x09FF),  # Bengali
    "Gujarati":   (0x0A80, 0x0AFF),  # Gujarati
    "Tamil":      (0x0B80, 0x0BFF),  # Tamil
    "Telugu":     (0x0C00, 0x0C7F),  # Telugu
    "Kannada":    (0x0C80, 0x0CFF),  # Kannada
}

# Distinguish Marathi from Hindi in Devanagari script via specific characters and grammatical words
MARATHI_SPECIFIC_CHARS = {"ळ", "ऱ"}
MARATHI_GRAMMAR_WORDS = {
    "आहे", "आहेत", "नाही", "नाहीत", "झाले", "होते", "करावे", "मिळतात",
    "यांसारख्या", "आणि", "कसे", "कोणते", "मध्ये", "केले", "यांचे", "त्यांचे",
    "म्हणून", "पाहिजे", "दिले", "करा", "बदल", "झाला"
}

# Distinguish Sanskrit via case endings and visarga patterns
SANSKRIT_MARKERS = ["ः", "म्", "स्य", "भ्याम्", "एभ्यः", "अस्ति", "भवति", "इति", "आयुर्वेदः", "ज्ञानम्"]

ROMANIZED_HINDI_WORDS = {
    "kya", "kyun", "kyon", "kaise", "kahan", "kab", "kitna", "kitni", "kaun",
    "nahi", "nahin", "mujhe", "mera", "meri", "mere", "hum", "humara",
    "aap", "aapka", "tum", "tumhara", "yeh", "woh", "isko", "usko",
    "hoga", "hogi", "hoge", "karna", "karne", "karein", "chahiye",
    "sakte", "sakti", "sakta", "raha", "rahi", "rahe", "hai", "hain",
    "hoon", "tha", "thi", "bhi", "toh", "lekin", "magar", "namaste", "dhanyawad"
}


@dataclass
class DetectionResult:
    """Result of language detection."""
    language: str
    confidence: float
    script: Optional[str] = None
    is_mixed: bool = False
    secondary_language: Optional[str] = None
    method: str = "unknown"

    @property
    def language_name(self) -> str:
        return LANGUAGE_NAMES.get(self.language, self.language)


class LanguageDetector:
    """
    Detects language of input text with high precision for Indian languages.
    """

    def __init__(self, default_language: str = "en"):
        self.default_language = default_language
        self._langdetect_available = False
        try:
            import langdetect
            from langdetect import DetectorFactory
            DetectorFactory.seed = 0
            self._langdetect_available = True
        except ImportError:
            pass

    def detect(self, text: str) -> DetectionResult:
        """Detect language of the given text."""
        if not text or not text.strip():
            return DetectionResult(
                language=self.default_language,
                confidence=0.0,
                method="empty_input"
            )

        text_clean = text.strip()

        # Step 1: Script analysis by character counting
        script_counts: Dict[str, int] = {}
        total_letters = 0
        has_latin = False

        for char in text_clean:
            if not char.isalpha() and not unicodedata.combining(char):
                continue
            total_letters += 1
            code = ord(char)

            # Check Latin
            if ("a" <= char.lower() <= "z"):
                has_latin = True

            # Check Indic scripts
            matched = False
            for script_name, (start, end) in SCRIPT_UNICODE_RANGES.items():
                if start <= code <= end:
                    script_counts[script_name] = script_counts.get(script_name, 0) + 1
                    matched = True
                    break

        if total_letters == 0:
            return DetectionResult(language=self.default_language, confidence=0.0, method="no_letters")

        # Step 2: High-confidence Indic script detection
        if script_counts:
            dominant_script, count = max(script_counts.items(), key=lambda x: x[1])
            ratio = count / total_letters

            if dominant_script == "Devanagari":
                # Check if Sanskrit
                is_sanskrit = any(marker in text_clean for marker in SANSKRIT_MARKERS)
                # Check if Marathi (via distinct characters ळ, ऱ or distinct Marathi grammar words)
                is_marathi = (
                    any(ch in text_clean for ch in MARATHI_SPECIFIC_CHARS) or
                    any(w in text_clean.split() for w in MARATHI_GRAMMAR_WORDS)
                )

                lang = "sa" if is_sanskrit else ("mr" if is_marathi else "hi")
                return DetectionResult(
                    language=lang,
                    confidence=min(1.0, 0.85 + (ratio * 0.15)),
                    script="Devanagari",
                    is_mixed=has_latin,
                    method="script_analysis"
                )

            elif dominant_script == "Bengali":
                return DetectionResult(language="bn", confidence=0.95, script="Bengali", is_mixed=has_latin, method="script_analysis")
            elif dominant_script == "Tamil":
                return DetectionResult(language="ta", confidence=0.95, script="Tamil", is_mixed=has_latin, method="script_analysis")
            elif dominant_script == "Telugu":
                return DetectionResult(language="te", confidence=0.95, script="Telugu", is_mixed=has_latin, method="script_analysis")
            elif dominant_script == "Gujarati":
                return DetectionResult(language="gu", confidence=0.95, script="Gujarati", is_mixed=has_latin, method="script_analysis")
            elif dominant_script == "Kannada":
                return DetectionResult(language="kn", confidence=0.95, script="Kannada", is_mixed=has_latin, method="script_analysis")

        # Step 3: Romanized Hindi check (Hinglish)
        words = re.findall(r"\b[a-zA-Z]+\b", text_clean.lower())
        if words:
            matched_hindi = set(w for w in words if w in ROMANIZED_HINDI_WORDS)
            # Require at least 2 distinct Hinglish words, or 1 if very short query (<= 2 words)
            if (len(matched_hindi) >= 2) or (len(words) <= 2 and len(matched_hindi) >= 1):
                return DetectionResult(
                    language="hi",
                    confidence=0.75,
                    script="Latin",
                    is_mixed=True,
                    method="romanized_keywords"
                )

        # Step 4: Statistical langdetect (with guard for Indian languages + English)
        if self._langdetect_available:
            try:
                import langdetect
                detected = langdetect.detect(text_clean)
                valid_codes = [lang.value for lang in Language]
                if detected in valid_codes:
                    return DetectionResult(language=detected, confidence=0.85, method="langdetect")
                # If statistical detector returned something unrelated (like 'it' for mixed 'Hello नमस्ते')
                if any(ord(c) >= 0x0900 for c in text_clean):
                    return DetectionResult(language="hi", confidence=0.8, script="Devanagari", is_mixed=True, method="script_fallback")
                return DetectionResult(language="en", confidence=0.8, method="langdetect_default_en")
            except Exception:
                pass

        # Step 5: Default to English
        return DetectionResult(
            language="en",
            confidence=0.7,
            method="fallback_default"
        )
