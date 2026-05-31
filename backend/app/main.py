"""GraphFraud demo backend - production-ready POC.

In production: this service would query a real entity-resolution graph
(Neo4j / NebulaGraph) seeded with transaction history, KYC, device
fingerprints, and run motif detection. For the demo: it only invokes
the LLM and returns a fictional but coherent fraud-graph analysis.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="GraphFraud Demo Backend",
    description="POC backend - Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Prompts
# -----------------------------------------------------------------------------
SYSTEM_PROMPT_FR = """Tu es GraphFraud, un agent IA d'analyse de fraude par graphe relationnel. L'utilisateur te donne deux identifiants de comptes (clients/marchands/IBANs) et une description du lien suspecte. Tu DOIS jouer un analyste fraude senior d'une banque tier-1 et produire une analyse risque inventee mais coherente, comme si tu avais deja inspecte le graphe.

Format de sortie exact en MARKDOWN :
**🚨 Score de risque**
- Score sur 100 + verdict en 1 phrase (ex: "82/100 - Reseau suspect probable, escalation recommandee")

**🕸️ Chemin du graphe (3-5 sauts)**
- Liste de 3 a 5 noeuds intermediaires avec relation (ex: "Compte A -> [tel partage] -> Tiers X -> [meme device fingerprint] -> Compte B")

**🔍 Patterns detectes**
- 3 puces : reutilisation d'identifiants, motif velocity, anomalies temporelles, lien geographique, structuration

**🎯 Actions recommandees**
- 2-3 puces : declaration TRACFIN, gel transactionnel, demande d'enquete CNFC, KYC renforce

Reste sobre, registre conformite/AML. Maximum 320 mots. Tout est invente pour la demo, jamais "je n'ai pas acces aux donnees"."""

SYSTEM_PROMPT_EN = """You are GraphFraud, an AI fraud analysis agent based on relationship graphs. The user gives you two account IDs (clients/merchants/IBANs) and a description of the suspected link. You MUST play a senior fraud analyst at a tier-1 bank and produce an invented but coherent risk analysis, as if you had inspected the graph.

Exact MARKDOWN output format:
**🚨 Risk score**
- Score out of 100 + 1-sentence verdict (e.g. "82/100 - Likely suspect network, escalation recommended")

**🕸️ Graph path (3-5 hops)**
- 3 to 5 intermediate nodes with relation (e.g. "Account A -> [shared phone] -> Third party X -> [same device fingerprint] -> Account B")

**🔍 Patterns detected**
- 3 bullets: identifier reuse, velocity pattern, time anomalies, geographic link, structuring

**🎯 Recommended actions**
- 2-3 bullets: SAR/FinCEN filing, transaction freeze, investigation request, enhanced KYC

Stay sober, compliance/AML register. Max 320 words. Everything is invented for the demo, never "I don't have access to the data"."""


# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class GenerateRequest(BaseModel):
    account_a: str = Field(..., min_length=1, max_length=60)
    account_b: str = Field(..., min_length=1, max_length=60)
    suspect_link: str = Field("", max_length=400)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    output: str
    model: str
    generated_at: str
    static_mode: bool = False


# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "graphfraud-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    a = (req.account_a or "").strip()[:60]
    b = (req.account_b or "").strip()[:60]
    link = (req.suspect_link or "").strip()[:400]
    if not a or not b:
        raise HTTPException(status_code=400, detail="empty_accounts")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        f'Compte A : "{a}". Compte B : "{b}". Lien suspecte : "{link or "transactions repetees"}". Produis l\'analyse graphe.'
        if req.lang == "fr"
        else f'Account A: "{a}". Account B: "{b}". Suspected link: "{link or "repeated transactions"}". Produce the graph analysis.'
    )

    if not is_configured():
        return GenerateResponse(
            output=_build_mock_brief(a, b, link, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            output=_build_mock_brief(a, b, link, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(output=text, model=model, generated_at=now_iso)


# -----------------------------------------------------------------------------
# Mock brief (used when no LLM key configured)
# -----------------------------------------------------------------------------
def _build_mock_brief(a: str, b: str, link: str, lang: str) -> str:
    if lang == "en":
        return (
            f"**🚨 Risk score**\n"
            f"- 78/100 - Likely suspect network, escalation recommended\n\n"
            f"**🕸️ Graph path (3-5 hops)**\n"
            f'- Account {a} -> [shared phone +33 6XX] -> Third party "ProxyTrade Ltd" -> [same device fingerprint] -> Account {b}\n'
            f"- Alt path: {a} -> [IBAN beneficiary in common] -> Mule node M-447 -> {b}\n\n"
            f"**🔍 Patterns detected**\n"
            f"- Velocity 14 transactions <72h between A and B via 2 intermediaries\n"
            f"- Reused device fingerprint (browser+OS+timezone) on 4 nodes\n"
            f"- Geographic anomaly: A in FR, intermediaries in BG/MT, B in FR\n\n"
            f"**🎯 Recommended actions**\n"
            f"- SAR/FinCEN filing with full graph attached\n"
            f"- Temporary freeze of {a} and {b} pending investigation\n"
            f"- Enhanced KYC on intermediaries M-447 and ProxyTrade Ltd\n\n"
            f'Suspected link: {link or "repeated transactions"}.'
        )
    return (
        f"**🚨 Score de risque**\n"
        f"- 78/100 - Reseau suspect probable, escalation recommandee\n\n"
        f"**🕸️ Chemin du graphe (3-5 sauts)**\n"
        f'- Compte {a} -> [tel partage +33 6XX] -> Tiers "ProxyTrade Ltd" -> [meme device fingerprint] -> Compte {b}\n'
        f"- Chemin alt : {a} -> [IBAN beneficiaire commun] -> Noeud mule M-447 -> {b}\n\n"
        f"**🔍 Patterns detectes**\n"
        f"- Velocity 14 transactions <72h entre A et B via 2 intermediaires\n"
        f"- Device fingerprint reutilise (navigateur+OS+timezone) sur 4 noeuds\n"
        f"- Anomalie geographique : A en FR, intermediaires en BG/MT, B en FR\n\n"
        f"**🎯 Actions recommandees**\n"
        f"- Declaration TRACFIN avec graphe complet joint\n"
        f"- Gel transactionnel temporaire de {a} et {b} en attendant l'enquete\n"
        f"- KYC renforce sur intermediaires M-447 et ProxyTrade Ltd\n\n"
        f'Lien suspecte : {link or "transactions repetees"}.'
    )
