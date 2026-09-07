# IP-SAKTI Sahayak — Translator Module

A dedicated, self-contained Indic language translation and detection module for the **IP-SAKTI Sahayak** RAG system (SIH 2026 Problem Statement 26045).

---

## 🌟 Key Features

1. **Indic Language Support**:
   - 7 Indian Languages: Hindi (`hi`), Bengali (`bn`), Tamil (`ta`), Telugu (`te`), Marathi (`mr`), Gujarati (`gu`), Kannada (`kn`)
   - Classical Script: Sanskrit (`sa`)
   - Target / Pivot Language: English (`en`)

2. **Domain-Specific Ayurveda & IP Dictionary**:
   - **Ayurveda**: Formulations, doshas (Vata, Pitta, Kapha), Rasa Shastra, Bhasma, medicinal plants (Ashwagandha, Tulsi, Neem, Amla, Triphala).
   - **Intellectual Property (IP)**: Patent eligibility, Section 3(p)/3(d), prior art, TKDL (Traditional Knowledge Digital Library), biopiracy prevention, novelty, claims.
   - **Regulatory**: AYUSH ministry, licensing, clinical trials, safety standards.

3. **Multi-Engine Neural Translation**:
   - Primary: `deep-translator` (Google Translate neural engine) with retry logic.
   - Secondary: `googletrans` (automatic fallback).
   - Offline fallback: Domain dictionary mapping when internet is unavailable.

4. **Bidirectional**:
   - Indic Languages ➡️ English (for RAG document retrieval and LLM context).
   - English ➡️ Indic Languages (to formulate the response back to the citizen).

5. **Integrated Script & Language Detector**:
   - Fast Unicode block character-range detector.
   - Distinguishes Devanagari (Hindi, Marathi, Sanskrit), Bengali, Tamil, Telugu, Gujarati, and Kannada with >95% confidence.

---

## 📂 Folder Structure

```
translator/
├── __init__.py           # Package exports (Translator, LanguageDetector, etc.)
├── engine.py             # TranslationEngine implementation
├── dictionary.py         # Complete Ayurveda, IP, and Govt domain dictionary
├── detector.py           # Indian language script & keyword detector
├── models.py             # TranslationResult, Language dataclasses
├── demo.py               # Interactive CLI benchmark & live query translator
├── test_translator.py    # Standalone test runner
└── README.md             # Documentation
```

---

## 🚀 Quick Start

### 1. Run the Demo & Benchmark
```bash
python translator/demo.py
```

### 2. Run Interactive Translation Prompt
```bash
python translator/demo.py --interactive
```

### 3. Run Self-Contained Tests
```bash
python translator/test_translator.py
```

### 4. Python Code Example
```python
from translator import Translator, LanguageDetector

# Initialize
engine = Translator()
detector = LanguageDetector()

# 1. Automatic Language Detection & Translation
query = "क्या मैं अश्वगंधा के पारंपरिक योग पर पेटेंट प्राप्त कर सकता हूँ?"
res = engine.translate(query, source="auto", target="en")

print("Translated:", res.translated_text)
# Output: "Can I obtain a patent on traditional formulations of Ashwagandha?"
print("Backend:", res.backend)
print("Domain terms found:", res.domain_terms_found)

# 2. Reverse Translation (English to Hindi)
reply = "Under Section 3(p) of the Indian Patent Act, traditional knowledge cannot be patented."
rev = engine.translate(reply, source="en", target="hi")
print("Hindi Reply:", rev.translated_text)
```
