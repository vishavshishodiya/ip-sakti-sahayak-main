"""
Test Suite for IP-SAKTI Translator Module
"""

import os
import sys

# Ensure parent directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from translator import Translator, LanguageDetector, DomainDictionary, TranslationResult


def test_empty_and_passthrough():
    engine = Translator()
    # Empty
    res = engine.translate("", source="hi", target="en")
    assert res.translated_text == ""
    assert res.confidence == 0.0

    # Passthrough
    res = engine.translate("Hello world", source="en", target="en")
    assert res.translated_text == "Hello world"
    assert res.backend == "passthrough"
    print("✓ Empty & passthrough tests passed.")


def test_exact_domain_dictionary():
    engine = Translator()

    # Ayurveda term exact match
    res = engine.translate("अश्वगंधा", source="hi", target="en")
    assert "Ashwagandha" in res.translated_text
    assert res.backend == "domain_dictionary"

    # IP term exact match
    res = engine.translate("पेटेंट", source="hi", target="en")
    assert res.translated_text.lower() == "patent"
    assert res.backend == "domain_dictionary"

    # Reverse English to Hindi
    res_rev = engine.translate("patent", source="en", target="hi")
    assert "पेटेंट" in res_rev.translated_text
    print("✓ Exact domain dictionary (bidirectional) tests passed.")


def test_sentence_translation_deep_translator():
    engine = Translator()
    # Test a full Ayurveda sentence to ensure it doesn't get corrupted by partial-match
    query = "क्या मैं अश्वगंधा के पारंपरिक योग पर पेटेंट प्राप्त कर सकता हूँ?"
    res = engine.translate(query, source="hi", target="en")

    assert len(res.translated_text) > 0
    # Must NOT have untranslated Devanagari mixed in
    devanagari_chars = [c for c in res.translated_text if 0x0900 <= ord(c) <= 0x097F]
    assert len(devanagari_chars) == 0, f"Translation has untranslated Devanagari: {res.translated_text}"
    print(f"✓ Full sentence translation passed: '{res.translated_text}' (Backend: {res.backend})")


def test_language_detection():
    detector = LanguageDetector()

    # Hindi
    res_hi = detector.detect("मुझे पेटेंट की जानकारी चाहिए")
    assert res_hi.language == "hi"
    assert res_hi.script == "Devanagari"

    # Bengali
    res_bn = detector.detect("ঐতিহ্যগত জ্ঞানের ওপর পেটেন্ট")
    assert res_bn.language == "bn"
    assert res_bn.script == "Bengali"

    # Tamil
    res_ta = detector.detect("ஆயுர்வேத மருந்து காப்புரிமை")
    assert res_ta.language == "ta"
    assert res_ta.script == "Tamil"

    # Telugu
    res_te = detector.detect("ఆయుర్వేద ఔషధాల పేటెంట్")
    assert res_te.language == "te"
    assert res_te.script == "Telugu"

    # Marathi
    res_mr = detector.detect("हळद आणि कडुलिंब यांसारख्या औषधी वनस्पतींवर पेटंट अधिकार मिळतात का?")
    assert res_mr.language == "mr"
    assert res_mr.script == "Devanagari"

    # Hindi TKDL (with 'ज्ञान' must remain Hindi, not Marathi)
    res_tkdl = detector.detect("पारंपरिक ज्ञान डिजिटल लाइब्रेरी")
    assert res_tkdl.language == "hi"
    assert res_tkdl.script == "Devanagari"

    # Sanskrit
    res_sa = detector.detect("आयुर्वेदः पारम्परिकज्ञानम् अस्ति")
    assert res_sa.language == "sa"
    assert res_sa.script == "Devanagari"

    # English legal patent sentence (not misidentified as Hinglish)
    res_en = detector.detect("Patent eligibility under Section 3(p) of the Indian Patent Act.")
    assert res_en.language == "en"

    # Romanized Hindi (Hinglish)
    res_hinglish = detector.detect("kya mujhe ashwagandha formulation par patent mil sakta hai?")
    assert res_hinglish.language == "hi"
    assert res_hinglish.script == "Latin"

    # Mixed script
    res_mix = detector.detect("Hello नमस्ते")
    assert res_mix.language in ["en", "hi"]

    print("✓ Language detection across Indic scripts & English disambiguation passed.")


def test_batch_translation():
    engine = Translator()
    terms = ["पेटेंट", "पारंपरिक ज्ञान", "आयुर्वेद"]
    results = engine.translate_batch(terms, source="hi", target="en")
    assert len(results) == 3
    assert all(isinstance(r, TranslationResult) for r in results)
    print("✓ Batch translation test passed.")


if __name__ == "__main__":
    print("Running Translator Tests...\n")
    test_empty_and_passthrough()
    test_exact_domain_dictionary()
    test_language_detection()
    test_sentence_translation_deep_translator()
    test_batch_translation()
    print("\n🎉 ALL TRANSLATOR TESTS PASSED!")
