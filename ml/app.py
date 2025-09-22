from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
import math

app = FastAPI()
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

class CandReq(BaseModel):
    description: str
    top_k: int = 5
    invoice_numbers: list[str]

class ScoreReq(BaseModel):
    sim_text: float
    delta_days: float
    amount: float
    saldo: float

@app.post('/candidates')
def candidates(req: CandReq):
    # Placeholder: similitud aleatoria controlada (demo). En producción: usar pgvector.
    rng = np.random.default_rng(abs(hash(req.description)) % (2**32))
    cands = []
    for n in req.invoice_numbers:
        sim = float(0.5 + 0.5 * rng.random())
        cands.append({'number': n, 'sim': sim})
    cands = sorted(cands, key=lambda x: x['sim'], reverse=True)[:req.top_k]
    return {'candidates': cands}

@app.post('/score')
def score(req: ScoreReq):
    def date_score(d): return math.exp(-abs(d)/5.0)
    def amount_score(a, s):
        if s <= 0: return 0.0
        return 1.0 - min(abs(a - s) / max(a, s), 1.0)
    sc = 0.55*req.sim_text + 0.25*date_score(req.delta_days) + 0.20*amount_score(req.amount, req.saldo)
    sc = max(0.0, min(1.0, sc))
    reasons = {'sim_text': req.sim_text, 'date_score': date_score(req.delta_days), 'amount_score': amount_score(req.amount, req.saldo)}
    return {'score': sc, 'reasons': reasons}
