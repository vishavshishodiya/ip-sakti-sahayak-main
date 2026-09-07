#!/usr/bin/env python3
"""Replace IP-SAKTI's FAISS index with cited public Ayurveda sources.

Downloads the openly licensed Charak Samhita Online edition, then also indexes
database final.txt and any .txt/.md/.pdf files in public_ayurveda_sources/.
"""
from __future__ import annotations
import argparse, json, shutil, sys, time
from datetime import datetime
from pathlib import Path
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen
from rag_engine import RAGEngine

ROOT = Path(__file__).resolve().parent
DB_TEXT = ROOT.parent / "database final.txt"
SOURCES = ROOT / "public_ayurveda_sources"
API = "https://www.carakasamhitaonline.com/api.php"
LICENSE = "CC BY-NC-SA 4.0"

def split(text, size=450, overlap=60):
    words = text.split()
    for start in range(0, len(words), size-overlap):
        value = " ".join(words[start:start+size]).strip()
        if value: yield value
        if start + size >= len(words): break

def charaka_records():
    records, cont = [], {}
    while True:
        params = {"action":"query", "format":"json", "generator":"allpages", "gapnamespace":"0", "gaplimit":"50", "prop":"extracts|info", "explaintext":"1", "inprop":"url", **cont}
        req = Request(API+"?"+urlencode(params), headers={"User-Agent":"IP-SAKTI Sahayak educational RAG builder"})
        with urlopen(req, timeout=60) as r: payload = json.loads(r.read().decode("utf-8"))
        for page in payload.get("query",{}).get("pages",{}).values():
            text = (page.get("extract") or "").strip()
            if len(text.split()) >= 40:
                title = page.get("title","Untitled")
                records.append({"text":text,"metadata":{"source":"Charak Samhita Online","title":title,"source_url":page.get("fullurl") or "https://www.carakasamhitaonline.com/index.php/"+quote(title.replace(" ","_")),"license":LICENSE,"license_url":"https://creativecommons.org/licenses/by-nc-sa/4.0/","retrieved_at":datetime.now().isoformat(timespec="seconds")}})
        cont = payload.get("continue",{})
        if not cont: return records
        time.sleep(.3)

def local_records(path):
    if path.suffix.lower() in {".txt", ".md"}:
        text = path.read_text(encoding="utf-8", errors="replace")
        return [{"text":x,"metadata":{"source":path.name,"title":path.stem,"license":"User-supplied; verify reuse rights","retrieved_at":datetime.now().isoformat(timespec="seconds")}} for x in split(text)]
    if path.suffix.lower() == ".pdf":
        try: from pypdf import PdfReader
        except ImportError: raise RuntimeError("Install pypdf to add PDF sources: pip install pypdf")
        result=[]
        for n,page in enumerate(PdfReader(str(path)).pages,1):
            result += [{"text":x,"metadata":{"source":path.name,"title":path.stem,"page":n,"license":"User-supplied; verify reuse rights"}} for x in split(page.extract_text() or "")]
        return result
    return []

def backup():
    source=ROOT/"faiss_data"
    if not source.exists(): return None
    dest=ROOT/"faiss_data_backups"/f"faiss_backup_before_public_ayurveda_{datetime.now():%Y%m%d_%H%M%S}"
    dest.parent.mkdir(exist_ok=True); shutil.copytree(source,dest); return dest

def main():
    p=argparse.ArgumentParser(); p.add_argument("--skip-charaka-download",action="store_true");p.add_argument("--skip-confirm",action="store_true");p.add_argument("--batch-size",type=int,default=48);args=p.parse_args()
    try:
        remote=[] if args.skip_charaka_download else charaka_records()
        SOURCES.mkdir(exist_ok=True); local=[]
        if DB_TEXT.exists(): local += local_records(DB_TEXT)
        for f in SOURCES.rglob("*"):
            if f.is_file(): local += local_records(f)
    except Exception as e: print(f"Source collection failed: {e}",file=sys.stderr);return 1
    records=remote+local
    if not records: print("No indexable source text found.",file=sys.stderr);return 1
    (SOURCES/"ATTRIBUTION.md").write_text(f"# Source attribution\n\nCharak Samhita Online: {len(remote)} articles, {LICENSE}.\n<https://www.carakasamhitaonline.com/index.php/Main_Page>\n\nPreserve attribution and comply with CC BY-NC-SA 4.0.\nLocal chunks: {len(local)}. Verify rights for all local files.\n",encoding="utf-8")
    print(f"Collected {len(remote)} Charaka articles and {len(local)} local chunks.")
    if not args.skip_confirm and input("Back up and replace the FAISS database? [y/N]: ").lower() not in {"y","yes"}: return 0
    print("Backup:",backup())
    rag=RAGEngine();rag.vector_store.clear_collection()
    for i in range(0,len(records),args.batch_size):
        rag.vector_store.add_documents(records[i:i+args.batch_size]);print(f"Indexed {min(i+args.batch_size,len(records))}/{len(records)}",end="\r",flush=True)
    print("\nComplete:",rag.get_stats().get("document_count"),"chunks")
    return 0
if __name__=="__main__": raise SystemExit(main())
