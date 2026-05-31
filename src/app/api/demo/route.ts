import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es GraphFraud, un agent IA d'analyse de fraude par graphe relationnel. L'utilisateur te donne deux identifiants de comptes (clients/marchands/IBANs) et une description du lien suspecte. Tu DOIS jouer un analyste fraude senior d'une banque tier-1 et produire une analyse risque inventee mais coherente, comme si tu avais deja inspecte le graphe.

Format de sortie exact en MARKDOWN :
**🚨 Score de risque**
- Score sur 100 + verdict en 1 phrase (ex: "82/100 - Reseau suspect probable, escalation recommandee")

**🕸️ Chemin du graphe (3-5 sauts)**
- Liste de 3 a 5 noeuds intermediaires avec relation (ex: "Compte A -> [tel partage] -> Tiers X -> [meme device fingerprint] -> Compte B")

**🔍 Patterns detectes**
- 3 puces : reutilisation d'identifiants, motif velocity, anomalies temporelles, lien geographique, structuration

**🎯 Actions recommandees**
- 2-3 puces : declaration TRACFIN, gel transactionnel, demande d'enquete CNFC, KYC renforce

Reste sobre, registre conformite/AML. Maximum 320 mots. Tout est invente pour la demo, jamais "je n'ai pas acces aux donnees".`;

const SYSTEM_PROMPT_EN = `You are GraphFraud, an AI fraud analysis agent based on relationship graphs. The user gives you two account IDs (clients/merchants/IBANs) and a description of the suspected link. You MUST play a senior fraud analyst at a tier-1 bank and produce an invented but coherent risk analysis, as if you had inspected the graph.

Exact MARKDOWN output format:
**🚨 Risk score**
- Score out of 100 + 1-sentence verdict (e.g. "82/100 - Likely suspect network, escalation recommended")

**🕸️ Graph path (3-5 hops)**
- 3 to 5 intermediate nodes with relation (e.g. "Account A -> [shared phone] -> Third party X -> [same device fingerprint] -> Account B")

**🔍 Patterns detected**
- 3 bullets: identifier reuse, velocity pattern, time anomalies, geographic link, structuring

**🎯 Recommended actions**
- 2-3 bullets: SAR/FinCEN filing, transaction freeze, investigation request, enhanced KYC

Stay sober, compliance/AML register. Max 320 words. Everything is invented for the demo, never "I don't have access to the data".`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const accountA: string = typeof body.accountA === "string" ? body.accountA.trim().slice(0, 60) : "";
    const accountB: string = typeof body.accountB === "string" ? body.accountB.trim().slice(0, 60) : "";
    const link: string = typeof body.link === "string" ? body.link.trim().slice(0, 400) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!accountA || !accountB) {
      return NextResponse.json(
        { error: lang === "fr" ? "Entrez les deux identifiants de comptes." : "Enter both account IDs." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique - la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode - LLM key will be configured at next deploy.",
          mockOutput: buildMock(accountA, accountB, link, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Compte A : "${accountA}". Compte B : "${accountB}". Lien suspecte : "${link || "transactions repetees"}". Produis l'analyse graphe.`
      : `Account A: "${accountA}". Account B: "${accountB}". Suspected link: "${link || "repeated transactions"}". Produce the graph analysis.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ output: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMock(a: string, b: string, link: string, lang: "fr" | "en"): string {
  if (lang === "en") {
    return `**🚨 Risk score**\n- 78/100 - Likely suspect network, escalation recommended\n\n**🕸️ Graph path (3-5 hops)**\n- Account ${a} -> [shared phone +33 6XX] -> Third party "ProxyTrade Ltd" -> [same device fingerprint] -> Account ${b}\n- Alt path: ${a} -> [IBAN beneficiary in common] -> Mule node M-447 -> ${b}\n\n**🔍 Patterns detected**\n- Velocity 14 transactions <72h between A and B via 2 intermediaries\n- Reused device fingerprint (browser+OS+timezone) on 4 nodes\n- Geographic anomaly: A in FR, intermediaries in BG/MT, B in FR\n\n**🎯 Recommended actions**\n- SAR/FinCEN filing with full graph attached\n- Temporary freeze of ${a} and ${b} pending investigation\n- Enhanced KYC on intermediaries M-447 and ProxyTrade Ltd\n\nSuspected link: ${link || "repeated transactions"}.`;
  }
  return `**🚨 Score de risque**\n- 78/100 - Reseau suspect probable, escalation recommandee\n\n**🕸️ Chemin du graphe (3-5 sauts)**\n- Compte ${a} -> [tel partage +33 6XX] -> Tiers "ProxyTrade Ltd" -> [meme device fingerprint] -> Compte ${b}\n- Chemin alt : ${a} -> [IBAN beneficiaire commun] -> Noeud mule M-447 -> ${b}\n\n**🔍 Patterns detectes**\n- Velocity 14 transactions <72h entre A et B via 2 intermediaires\n- Device fingerprint reutilise (navigateur+OS+timezone) sur 4 noeuds\n- Anomalie geographique : A en FR, intermediaires en BG/MT, B en FR\n\n**🎯 Actions recommandees**\n- Declaration TRACFIN avec graphe complet joint\n- Gel transactionnel temporaire de ${a} et ${b} en attendant l'enquete\n- KYC renforce sur intermediaires M-447 et ProxyTrade Ltd\n\nLien suspecte : ${link || "transactions repetees"}.`;
}
