"""
Translation Engine for IP-SAKTI Sahayak

Provides robust translation between Indian languages and English:
  - Exact domain dictionary lookup for specialized Ayurveda/IP terms
  - High-accuracy neural translation via deep-translator
  - Automatic fallback to googletrans
  - Automatic language detection integration
  - Bidirectional translation (Indic -> English and English -> Indic)
"""

import logging
import time
from typing import Dict, List, Optional, Union

from translator.models import LANGUAGE_NAMES, Language, TranslationResult
from translator.dictionary import DomainDictionary, GOVT_TERMS, AYURVEDA_TERMS, IP_TERMS
from translator.detector import LanguageDetector

logger = logging.getLogger(__name__)


class TranslationEngine:
    """
    Translates text between supported Indian languages, Sanskrit, and English.
    """

    # Retain GOVT_TERMS for backward compatibility
    GOVT_TERMS = GOVT_TERMS
    AYURVEDA_TERMS = AYURVEDA_TERMS
    IP_TERMS = IP_TERMS

    def __init__(self):
        self.dictionary = DomainDictionary()
        self.detector = LanguageDetector()

        self._deep_translator_available = False
        self._googletrans_available = False

        try:
            from deep_translator import GoogleTranslator  # noqa: F401
            self._deep_translator_available = True
        except ImportError:
            pass

        try:
            from googletrans import Translator  # noqa: F401
            self._googletrans_available = True
        except ImportError:
            pass

    # ------------------------------------------------------------------ #
    #  Public Translation API                                            #
    # ------------------------------------------------------------------ #

    def translate(
        self,
        text: str,
        source: str = "auto",
        target: str = "en",
    ) -> TranslationResult:
        """
        Translate text from source language to target language.

        Args:
            text:   Text to translate.
            source: Source language ISO code (e.g. 'hi', 'bn', 'ta') or 'auto'.
            target: Target language ISO code (e.g. 'en', 'hi').

        Returns:
            TranslationResult with translated text, confidence, backend, and metadata.
        """
        if not text or not text.strip():
            return TranslationResult(
                source_text=text,
                translated_text=text,
                source_lang=source if source != "auto" else "en",
                target_lang=target,
                confidence=0.0,
                backend="empty_input",
            )

        text_clean = text.strip()

        # Step 1: Resolve auto-detected language
        detected_lang = source
        if source == "auto":
            detection = self.detector.detect(text_clean)
            detected_lang = detection.language
            source = detected_lang

        # Step 2: Same language check
        if source == target:
            return TranslationResult(
                source_text=text_clean,
                translated_text=text_clean,
                source_lang=source,
                target_lang=target,
                confidence=1.0,
                backend="passthrough",
            )

        # Step 3: Exact Domain Dictionary Lookup (High Precision)
        # Check if entire query is an exact domain term
        dict_match, found_terms = self._lookup_exact_dictionary(text_clean, source, target)
        if dict_match:
            return TranslationResult(
                source_text=text_clean,
                translated_text=dict_match,
                source_lang=source,
                target_lang=target,
                confidence=1.0,
                backend="domain_dictionary",
                domain_terms_found=found_terms,
            )

        # Step 4: Primary Online Neural Translation (deep-translator)
        if self._deep_translator_available:
            result = self._translate_deep_translator(text_clean, source, target)
            if result:
                result.domain_terms_found = self._find_domain_terms(text_clean, source)
                return result

        # Step 5: Fallback Online Translation (googletrans)
        if self._googletrans_available:
            result = self._translate_googletrans(text_clean, source, target)
            if result:
                result.fallback_used = True
                result.domain_terms_found = self._find_domain_terms(text_clean, source)
                return result

        # Step 6: Offline Partial Phrase / Fallback
        # If offline and cannot reach online services, attempt best-effort phrase translation
        partial_result = self._translate_offline_fallback(text_clean, source, target)
        if partial_result:
            return partial_result

        # Step 7: Unavailable
        return TranslationResult(
            source_text=text_clean,
            translated_text=text_clean,
            source_lang=source,
            target_lang=target,
            confidence=0.0,
            backend="unavailable",
        )

    def translate_batch(
        self,
        texts: List[str],
        source: str = "auto",
        target: str = "en",
    ) -> List[TranslationResult]:
        """Translate a batch of texts independently."""
        return [self.translate(t, source, target) for t in texts]

    def get_supported_pairs(self) -> List[Dict[str, str]]:
        """Return list of supported language pairs."""
        pairs = []
        langs = [lang.value for lang in Language]
        for src in langs:
            for tgt in langs:
                if src != tgt:
                    pairs.append({
                        "source": src,
                        "target": tgt,
                        "source_name": LANGUAGE_NAMES.get(src, src),
                        "target_name": LANGUAGE_NAMES.get(tgt, tgt),
                    })
        return pairs

    # ------------------------------------------------------------------ #
    #  Internal Helpers & Backends                                       #
    # ------------------------------------------------------------------ #

    def _lookup_exact_dictionary(
        self, text: str, source: str, target: str
    ) -> (Optional[str], List[str]):
        """Exact dictionary match for terms & phrases."""
        text_lower = text.strip()

        # Indic -> English
        if target == "en":
            matched = self.dictionary.lookup_indic(text_lower, source)
            if matched:
                return matched, [text_lower]

        # English -> Indic
        elif source == "en":
            matched = self.dictionary.lookup_english(text_lower, target)
            if matched:
                return matched, [text_lower]

        return None, []

    def _find_domain_terms(self, text: str, lang: str) -> List[str]:
        """Identify which domain keywords are present in the text."""
        terms = self.dictionary.get_domain_keywords(lang)
        found = []
        for term in terms:
            if term in text:
                found.append(term)
        return found

    def _translate_deep_translator(
        self, text: str, source: str, target: str, retries: int = 3, base_delay: float = 0.5
    ) -> Optional[TranslationResult]:
        """Translate via deep-translator with exponential backoff retry logic."""
        try:
            from deep_translator import GoogleTranslator

            # GoogleTranslator expects ISO codes; deep-translator supports 'auto' as source
            src_param = "auto" if source == "auto" else source

            last_error: Optional[Exception] = None
            for attempt in range(retries):
                try:
                    translator = GoogleTranslator(source=src_param, target=target)
                    translated = translator.translate(text)
                    if translated:
                        return TranslationResult(
                            source_text=text,
                            translated_text=translated,
                            source_lang=source,
                            target_lang=target,
                            confidence=0.95,
                            backend="deep_translator",
                        )
                except Exception as exc:
                    last_error = exc
                    if attempt < retries - 1:
                        delay = base_delay * (2 ** attempt)
                        logger.warning(
                            "deep_translator attempt %d/%d failed (%s); retrying in %.1fs",
                            attempt + 1, retries, exc, delay,
                        )
                        time.sleep(delay)

            if last_error is not None:
                logger.warning(
                    "deep_translator exhausted %d retries for '%s' -> '%s': %s",
                    retries, source, target, last_error,
                )
            return None
        except Exception as exc:
            logger.warning("deep_translator unavailable: %s", exc)
            return None

    def _translate_googletrans(
        self, text: str, source: str, target: str
    ) -> Optional[TranslationResult]:
        """Translate using googletrans as fallback."""
        try:
            from googletrans import Translator

            translator = Translator()
            src_param = "auto" if source == "auto" else source
            translated = translator.translate(text, src=src_param, dest=target)

            if translated and translated.text:
                return TranslationResult(
                    source_text=text,
                    translated_text=translated.text,
                    source_lang=source,
                    target_lang=target,
                    confidence=0.85,
                    backend="googletrans",
                )
            return None
        except Exception:
            return None

    def _translate_offline_fallback(
        self, text: str, source: str, target: str
    ) -> Optional[TranslationResult]:
        """
        Offline fallback when internet is down:
        Only applies word/phrase replacement if at least some domain terms exist.
        """
        if target != "en":
            return None

        terms = self.dictionary.get_terms_for_lang(source)
        if not terms:
            return None

        words = text.split()
        translated_parts = []
        replaced_any = False
        found_terms = []

        for word in words:
            clean_word = word.strip(",.?!;:()\"'")
            if clean_word in terms:
                translated_parts.append(terms[clean_word])
                replaced_any = True
                found_terms.append(clean_word)
            else:
                translated_parts.append(word)

        if replaced_any:
            logger.warning(
                "Online translation unavailable (Google Translate unreachable). "
                "Falling back to partial word-level domain dictionary swap for '%s' -> '%s'. "
                "Output quality is degraded and NOT a full sentence translation: '%s'",
                source, target, text,
            )
            return TranslationResult(
                source_text=text,
                translated_text=" ".join(translated_parts),
                source_lang=source,
                target_lang=target,
                confidence=0.6,
                backend="domain_dictionary_partial",
                domain_terms_found=found_terms,
            )

        return None
