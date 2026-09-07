[README3.md](https://github.com/user-attachments/files/31923236/README3.md)
<div align="center">

# 🌿 IP-SAKTI Sahayak

### Vedic Wisdom Meets Neural RAG • Authentic Ayurvedic Intelligence

*Where 5,000 years of consecrated botanical pharmacology intersect with modern semantic retrieval — with direct canonical provenance and zero speculative dosha protocols.*

Built by **Team Technos** for **Smart India Hackathon (SIH)**

[![Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/vishavshishodiya/ip-sakti-sahayak-main)

</div>

---

## 📖 About the Project

**IP-SAKTI Sahayak** is an AI-powered Ayurvedic knowledge assistant that combines classical Vedic texts with modern Retrieval-Augmented Generation (RAG) to deliver authentic, verse-accurate answers to Ayurvedic health queries — grounded directly in canonical sources like **Charaka Samhita**, **Sushruta Samhita**, and **Vagbhata's** works, rather than speculative or generic advice.

## ✨ Features

- 🔍 **AI Sahayak (RAG Search)** — Query millions of verse embeddings from classical Ayurvedic texts with direct chapter-and-verse provenance
- 🌱 **Authentic Herbology & Rasayana** — 12,400+ classical Sanskrit formulations cross-referenced against authoritative Dravyaguna characteristics and modern phytochemical assays
- 📜 **Ancient Lineage Section** — Curated content sourced from Charaka, Sushruta & Vagbhata
- 💡 **Interesting Facts** — Bite-sized, verified Ayurvedic knowledge for casual exploration
- 🌐 **Multilingual Support** — Full interface available in 9 languages (see [Supported Languages](#-supported-languages))
- ✅ **Zero Speculative Answers** — Every response is traceable to a canonical text, not guesswork

## 🌐 Supported Languages

| Code | Language |
|------|----------|
| `en` | English |
| `hi` | Hindi |
| `sa` | Sanskrit |
| `bn` | Bengali |
| `ta` | Tamil |
| `te` | Telugu |
| `mr` | Marathi |
| `gu` | Gujarati |
| `kn` | Kannada |

You can switch languages in the header dropdown on the frontend, or by passing `"language":"hi"` in the `/api/rag` request body.

## 🖥️ Live Demo / Screenshot

*Add your live deployment link here, if available.*

## 🏗️ Architecture

```
┌──────────────────┐   /api/*    ┌──────────────────────┐  /retrieve  ┌──────────────┐
│  React Frontend  │ ──────────▶ │  FastAPI Orchestrator│ ──────────▶ │  RAG service │
│  (Vite, :5173)   │             │        (:8000)       │             │    (:8001)   │
└──────────────────┘             └──────────────────────┘             └──────────────┘
                                            │                                 │
                                            │ Google Gemini                   │ FAISS
                                            │ (gemini-3.6-flash)              │ (MiniLM-L6)
                                            ▼                                 ▼
                                  ┌──────────────────────┐
                                  │ translator (en ↔ hi) │
                                  │ + deep-translator    │
                                  └──────────────────────┘
```

| Component | Path | Port |
|-----------|------|------|
| React frontend | `frontend/` | 5173 |
| **Orchestrator** (new) | `backend/orchestrator.py` | 8000 |
| RAG service (FAISS) | `ip-sakti-rag/api.py` | 8001 |
| Translator package | `ipsakti_translator_fixed/` | — |
| LLM wrapper | `llm model/generate.py` | — |
| Knowledge base | `database final.txt` | — |

The orchestrator is the only piece you need to start the demo. It loads the translator and LLM wrapper as libraries and calls the RAG service over HTTP.

## 🛠️ Tech Stack

- **Frontend:** React + Vite (`localhost:5173`)
- **Orchestrator:** FastAPI (`localhost:8000`) — routes `/api/*` requests from the frontend
- **RAG Service:** Dedicated microservice (`localhost:8001`) handling `/retrieve` calls
- **Vector Search:** FAISS with `MiniLM-L6` sentence embeddings
- **LLM:** Google Gemini (`gemini-3.6-flash`) for response generation
- **Translation:** `deep-translator` + `langdetect` for English ↔ 8 Indic languages (Hindi, Sanskrit, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada)

## 📂 Project Layout

```
ip shakti shayak/
├── backend/                # NEW: orchestrator (FastAPI)
│   ├── orchestrator.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/               # React 19 + Vite + Tailwind
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── ip-sakti-rag/           # FAISS RAG service (FastAPI)
│   ├── api.py
│   ├── rag_engine.py
│   ├── vector_store.py
│   ├── document_processor.py
│   ├── config.py
│   └── requirements.txt
├── ipsakti_translator_fixed/   # Translator library (en ↔ 8 Indic langs)
│   ├── translator/
│   └── requirements.txt
├── llm model/              # Gemini wrapper (used by the orchestrator)
│   ├── generate.py
│   ├── rag_client.py
│   └── requirements.txt
├── .venv/                  # Shared virtualenv (gitignored)
├── .gitignore
└── README.md               # you are here
```

## 🔄 How the Orchestrator Works

For each `/api/rag` POST:

1. **Detect & translate to English** — if the user wrote in another language, the translator (`deep-translator` / `langdetect`) converts it.
2. **Retrieve** — calls the RAG service on `http://localhost:8001/retrieve` with `top_k=5` to get the most relevant chunks.
3. **Generate** — feeds the chunks to Gemini (`gemini-3.6-flash`) with a prompt that enforces "answer only from these sources, cite every claim as `[n]`".
4. **Translate back** — translates the answer to the user's language, preserving `[n]` citation markers.
5. **Shape the response** — fills the frontend's `RagResponse` schema (`title`, `summary`, `treatiseReference`, `shlokas`, `doshicImpact`, `dravyaguna`, `formulations`, `lifestyleRegimen`, `modernScience`, `precautions`, `suggestedQueries`, `sources`).
6. **Return** — JSON the frontend can render directly.

## 🔌 Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Liveness check |
| `/api/rag` | POST | Main RAG query → grounded answer JSON |
| `/api/translate` | POST | Standalone translation helper |

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18
Python >= 3.10
```

### Installation
```bash
# Clone the repository
git clone https://github.com/vishavshishodiya/ip-sakti-sahayak-main.git
cd ip-sakti-sahayak-main

# --- Frontend (React + Vite) ---
cd frontend
npm install
npm run dev                          # runs on http://localhost:5173

# --- Orchestrator (only piece needed to start the demo) ---
cd ../backend
pip install -r requirements.txt
uvicorn orchestrator:app --reload --port 8000

# --- RAG Service (FAISS) ---
cd ../ip-sakti-rag
pip install -r requirements.txt
uvicorn api:app --reload --port 8001
```

### Environment Variables
```bash
# Orchestrator / RAG service .env
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

*(Adjust folder names above to match your actual repo structure.)*

## ⚙️ Working Procedure

| Step | Component | Action |
|------|-----------|--------|
| 1 | **React Frontend** (`:5173`) | User submits a query through the UI |
| 2 | **FastAPI Orchestrator** (`:8000`) | Receives the request via `/api/*`, coordinates the flow |
| 3 | **RAG Service** (`:8001`) | Orchestrator calls `/retrieve` to fetch relevant verses |
| 4 | **FAISS + MiniLM-L6** | RAG service performs vector similarity search over embedded Ayurvedic texts |
| 5 | **Google Gemini** (`gemini-3.6-flash`) | Orchestrator sends retrieved context + query to Gemini for response generation |
| 6 | **Translator** (`deep-translator`) | If needed, translates the response between English ↔ Hindi |
| 7 | **React Frontend** | Final, verse-grounded answer is displayed to the user |

## ⚠️ Known Limitations (Hackathon Scope)

- The corpus is a single text file (`database final.txt`). Retrieval is keyword/embedding based and won't always be perfectly relevant.
- The structured fields (`shlokas`, `doshicImpact`, `dravyaguna`, `formulations`, `lifestyleRegimen`, `modernScience`) are filled with best-effort heuristics from the retrieved chunks. They're meant to be presentable, not authoritative.
- Translation uses Google Translate under the hood (via `deep-translator`), so quality varies by language pair.
- No authentication. The orchestrator binds to `127.0.0.1` for the demo.

## 🐞 Troubleshooting

- **`404 NOT_FOUND` from Gemini** — your key is valid but you may have an older SDK; the model is now `gemini-3.6-flash`. Both `generate.py` and `rag_engine.py` already use it.
- **RAG returns no chunks** — try lowering `similarity_threshold` in `ip-sakti-rag/config.py` (it's already set to `0.2`).
- **Frontend can't reach the orchestrator** — check that `frontend/.env` has `BACKEND_URL=http://localhost:8000` and that the orchestrator is on that port.
- **Hindi response looks garbled** — the response body is correct Devanagari UTF-8; old `cmd.exe` consoles display it as `?`. Open it in a real browser or use `python -c "import json,sys; ...print(..., file=sys.stdout)"`.

## 🔒 Security Note

If you ever pasted your Gemini API key into a public chat, regenerate it in Google AI Studio and paste the new one into `llm model/.env`. The `.gitignore` at the project root prevents `.env` from being committed, but secrets that were shared in conversation are still considered exposed.

## 👥 Team Technos

| Name | Role |
|------|------|
| *Add name* | *Add role* |
| *Add name* | *Add role* |
| *Add name* | *Add role* |

## 🏆 Built For

**Smart India Hackathon (SIH)**

## 📄 License

*Add your chosen license here (e.g. MIT).*

---

<div align="center">
Made with 🌿 and 🤖 by Team Technos
</div>
