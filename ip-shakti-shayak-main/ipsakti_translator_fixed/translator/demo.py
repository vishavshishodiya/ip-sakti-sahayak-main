"""
Interactive Demo & Benchmark for IP-SAKTI Sahayak Translator

Run directly with:
    python -m translator.demo
or
    python translator/demo.py
"""

import sys
import os

# Add parent directory to sys.path so it can be run from anywhere
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from translator import Translator, LanguageDetector


def run_benchmark():
    print("=" * 70)
    print("    🌿 IP-SAKTI SAHAYAK — TRANSLATOR MODULE DEMO 🌿")
    print("=" * 70)

    engine = Translator()
    detector = LanguageDetector()

    test_queries = [
        # Hindi - Ayurveda & Patent
        {
            "lang": "Hindi (Ayurveda Formulation)",
            "text": "क्या मैं अश्वगंधा और त्रिफला के पारंपरिक योग पर पेटेंट प्राप्त कर सकता हूँ?",
        },
        # Bengali - Prior Art / TKDL
        {
            "lang": "Bengali (Prior Art)",
            "text": "ঐতিহ্যগত জ্ঞানের ওপর কি পেটেন্ট আবেদন করা যায়?",
        },
        # Tamil - Biopiracy
        {
            "lang": "Tamil (Biopiracy Prevention)",
            "text": "ஆயுர்வேத மருந்துகளுக்கான அறிவுசார் சொத்துரிமை எவ்வாறு பாதுகாக்கப்படுகிறது?",
        },
        # Telugu - Licensing & Patent
        {
            "lang": "Telugu (Patent & AYUSH)",
            "text": "ఆయుష్ మంత్రిత్వ శాఖ ద్వారా ఆయుర్వేద ఔషధాల పేటెంట్ ఎలా పొందాలి?",
        },
        # Marathi - Herbs & Ownership
        {
            "lang": "Marathi (Medicinal Plants)",
            "text": "हळद आणि कडुलिंब यांसारख्या औषधी वनस्पतींवर पेटंट अधिकार मिळतात का?",
        },
        # Exact Domain Terms
        {
            "lang": "Exact Domain Term (Hindi)",
            "text": "पारंपरिक ज्ञान डिजिटल लाइब्रेरी",
        },
        # English -> Hindi (Reverse translation)
        {
            "lang": "English -> Hindi (Reverse)",
            "text": "Patent eligibility under Section 3(p) of the Indian Patent Act.",
            "source": "en",
            "target": "hi"
        }
    ]

    print("\n[1] Running Pre-configured Benchmark Test Queries:\n")

    for i, item in enumerate(test_queries, 1):
        text = item["text"]
        src = item.get("source", "auto")
        tgt = item.get("target", "en")

        # Detect language
        det = detector.detect(text)

        # Translate
        res = engine.translate(text, source=src, target=tgt)

        print(f"--- Query {i}: {item['lang']} ---")
        print(f"  Input text  : {text}")
        print(f"  Detected    : {det.language_name} ({det.language}) [Confidence: {det.confidence:.2f}, Script: {det.script}]")
        print(f"  Translation : {res.translated_text}")
        print(f"  Backend     : {res.backend}")
        if res.domain_terms_found:
            print(f"  Domain terms: {', '.join(res.domain_terms_found)}")
        print()

    print("=" * 70)
    print("✅ All benchmark queries completed successfully!")
    print("=" * 70)


def interactive_mode():
    engine = Translator()
    detector = LanguageDetector()

    print("\n--- 💬 Interactive Translation Mode ---")
    print("Type any text in any Indian language or English (or 'exit' to quit):\n")

    while True:
        try:
            user_input = input("Enter text > ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "q"]:
                print("Exiting...")
                break

            det = detector.detect(user_input)
            # Always translate TO English. If the input is already English,
            # engine.translate() detects source == target and returns it
            # unchanged via the "passthrough" backend (no API call made).
            target = "en"

            res = engine.translate(user_input, source=det.language, target=target)

            print(f"  -> Detected: {det.language_name} ({det.language})")
            print(f"  -> Target  : {target.upper()}")
            print(f"  -> Result  : {res.translated_text}")
            print(f"  -> Backend : {res.backend}")
            if res.domain_terms_found:
                print(f"  -> Keywords: {', '.join(res.domain_terms_found)}")
            print()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting...")
            break


if __name__ == "__main__":
    run_benchmark()
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_mode()
