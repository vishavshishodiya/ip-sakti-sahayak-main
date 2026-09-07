# mock_data.py
# Fake retrieval results — stand-in for your friend's RAG API until it's ready.
# Once their API is live, you'll replace get_mock_chunks() with a real API call.

def get_mock_chunks(query):
    """
    Pretend this came from the friend's RAG retrieval system.
    Later, this function will be replaced by a call like:
        requests.post("http://friends-ip:8000/retrieve", json={"query": query})
    """
    return [
        {
            "chunk_id": "TKDL-0234-p12",
            "text": "Turmeric (Curcuma longa) has been used in traditional Ayurvedic "
                    "medicine for wound healing for centuries, documented in classical texts.",
            "source": "TKDL",
            "document": "Ayurvedic Formulations Vol. 3",
            "url": "https://tkdl.res.in/doc/234",
            "score": 0.91
        },
        {
            "chunk_id": "USPTO-5401504",
            "text": "US Patent 5,401,504 originally claimed a method of using turmeric "
                    "powder for wound healing, later revoked after India challenged it "
                    "using TKDL prior-art evidence.",
            "source": "USPTO",
            "document": "US5401504",
            "url": "https://patents.google.com/patent/US5401504",
            "score": 0.87
        },
        {
            "chunk_id": "AYUSH-guideline-12",
            "text": "AYUSH Ministry guidelines require GI tag and traditional knowledge "
                    "disclosure for any patent application involving indigenous formulations.",
            "source": "AYUSH",
            "document": "AYUSH IP Guidelines 2021",
            "url": "https://ayush.gov.in/guidelines",
            "score": 0.78
        }
    ]
