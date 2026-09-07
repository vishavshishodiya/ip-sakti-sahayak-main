# IP-SAKTI Sahayak

A multilingual RAG-based AI assistant that helps with Ayurveda IP and regulatory
guidance. Ask questions in English, Hindi, Sanskrit, Bengali, Tamil, Telugu,
Marathi, Gujarati, or Kannada and get grounded answers from a curated Ayurveda
knowledge base (currently the `database final.txt` corpus).

This repository is a hackathon prototype. It is composed of pieces built
independently by different team members, wired together by a single FastAPI
**orchestrator** that handles translation, retrieval, generation, and
re-translation.

## Architecture

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

| Component                | Path                          | Port |
|--------------------------|-------------------------------|------|
| React frontend           | `frontend/`                   | 5173 |
| **Orchestrator** (new)   | `backend/orchestrator.py`     | 8000 |
| RAG service (FAISS)      | `ip-sakti-rag/api.py`         | 8001 |
| Translator package       | `ipsakti_translator_fixed/`   | —    |
| LLM wrapper              | `llm model/generate.py`       | —    |
| Knowledge base           | `database final.txt`          | —    |

The orchestrator is the only piece you need to start the demo. It loads the
translator and LLM wrapper as libraries and calls the RAG service over HTTP.

## Quick start (for the demo)

> **Prerequisites**
> - Python 3.11+
> - Node.js 18+
> - A Google Gemini API key (`GOOGLE_API_KEY` or `GEMINI_API_KEY`)

### 1. One-time setup

```bash
# from the project root
cd "C:/Users/Anshul Yadav/Downloads/ip shakti shayak"

# create a shared virtualenv
python -m venv .venv

# activate it (Windows, Git Bash)
source .venv/Scripts/activate

# install everything
pip install -r ip-sakti-rag/requirements.txt
pip install -r "llm model/requirements.txt"
pip install -r backend/requirements.txt

# install frontend deps
cd frontend
npm install
cd ..

# copy env templates
cp ip-sakti-rag/.env.example  ip-sakti-rag/.env
cp "llm model/.env.example"  "llm model/.env"
cp backend/.env.example      backend/.env
```

Then **put your Gemini API key** into `llm model/.env`:

```
GOOGLE_API_KEY=your_real_key_here
```

> ⚠️ **Never commit `*.env` files** — they contain secrets. The
> `.gitignore` at the project root already excludes them.

### 2. Run the three services (in three terminals)

```bash
# Terminal 1 — RAG service
cd ip-sakti-rag
../.venv/Scripts/python.exe -m uvicorn api:app --host 127.0.0.1 --port 8001
```

```bash
# Terminal 2 — Orchestrator
cd backend
../.venv/Scripts/python.exe -m uvicorn orchestrator:app --host 127.0.0.1 --port 8000
```

```bash
# Terminal 3 — Frontend
cd frontend
npm run dev
```

Open <http://localhost:5173>, click the **AI Sahayak (RAG)** tab in the
header, type a question in any of the 8 supported languages, and you should
get a grounded answer with citations within a few seconds.

### 3. Sanity check the orchestrator from the command line

```bash
# English
curl -X POST http://127.0.0.1:8000/api/rag \
  -H "Content-Type: application/json" \
  -d '{"query":"Is there a patent on turmeric?","language":"en"}'

# Hindi
curl -X POST http://127.0.0.1:8000/api/rag \
  -H "Content-Type: application/json" \
  -d '{"query":"हल्दी पर पेटेंट है क्या?","language":"hi"}'
```

## Supported languages

| Code | Language |
|------|----------|
| `en` | English  |
| `hi` | Hindi    |
| `sa` | Sanskrit |
| `bn` | Bengali  |
| `ta` | Tamil    |
| `te` | Telugu   |
| `mr` | Marathi  |
| `gu` | Gujarati |
| `kn` | Kannada  |

You can switch languages in the header dropdown on the frontend, or by passing
`"language":"hi"` in the `/api/rag` request body.

## Project layout

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

## How the orchestrator works

For each `/api/rag` POST:

1. **Detect & translate to English** — if the user wrote in another language,
   the translator (deep-translator / langdetect) converts it.
2. **Retrieve** — calls the RAG service on `http://localhost:8001/retrieve`
   with `top_k=5` to get the most relevant chunks.
3. **Generate** — feeds the chunks to Gemini (`gemini-3.6-flash`) with a
   prompt that enforces "answer only from these sources, cite every claim
   as `[n]`".
4. **Translate back** — translates the answer to the user's language,
   preserving `[n]` citation markers.
5. **Shape the response** — fills the frontend's `RagResponse` schema
   (`title`, `summary`, `treatiseReference`, `shlokas`, `doshicImpact`,
   `dravyaguna`, `formulations`, `lifestyleRegimen`, `modernScience`,
   `precautions`, `suggestedQueries`, `sources`).
6. **Return** — JSON the frontend can render directly.

## Key API endpoints

| Endpoint              | Method | Purpose                                |
|-----------------------|--------|----------------------------------------|
| `/api/health`         | GET    | Liveness check                         |
| `/api/rag`            | POST   | Main RAG query → grounded answer JSON  |
| `/api/translate`      | POST   | Standalone translation helper          |

## Known limitations (hackathon scope)

- The corpus is a single text file (`database final.txt`). Retrieval is
  keyword/embedding based and won't always be perfectly relevant.
- The structured fields (`shlokas`, `doshicImpact`, `dravyaguna`,
  `formulations`, `lifestyleRegimen`, `modernScience`) are filled with
  best-effort heuristics from the retrieved chunks. They're meant to be
  presentable, not authoritative.
- Translation uses Google Translate under the hood (via `deep-translator`),
  so quality varies by language pair.
- No authentication. The orchestrator binds to `127.0.0.1` for the demo.

## Troubleshooting

- **`404 NOT_FOUND` from Gemini** — your key is valid but you may have an
  older SDK; the model is now `gemini-3.6-flash`. Both `generate.py` and
  `rag_engine.py` already use it.
- **RAG returns no chunks** — try lowering `similarity_threshold` in
  `ip-sakti-rag/config.py` (it's already set to `0.2`).
- **Frontend can't reach the orchestrator** — check that
  `frontend/.env` has `BACKEND_URL=http://localhost:8000` and that the
  orchestrator is on that port.
- **Hindi response looks garbled** — the response body is correct
  Devanagari UTF-8; old `cmd.exe` consoles display it as `?`. Open it
  in a real browser or use `python -c "import json,sys; ...print(..., file=sys.stdout)"`.

## Security note

If you ever pasted your Gemini API key into a public chat, **regenerate it**
in Google AI Studio and paste the new one into `llm model/.env`. The
`.gitignore` at the project root prevents `.env` from being committed, but
secrets that were shared in conversation are still considered exposed.
