"use client";
import { useState } from "react";

const PRODUCT = "GraphFraud";

const PAL = {
  bg: "#110A1F",
  bg2: "#1A0F2E",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.09)",
  txt1: "#FCE2EE",
  txt2: "#B88AA0",
  txt3: "#80526C",
  accent: "#FF3E6C",
  accentSoft: "rgba(255,62,108,0.12)",
  accentBorder: "rgba(255,62,108,0.30)",
  accentGlow: "rgba(255,62,108,0.18)",
  navBg: "rgba(17,10,31,0.82)",
};

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [accountA, setAccountA] = useState("");
  const [accountB, setAccountB] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " - detection de fraude par graphe",
    desc: "Entrez deux identifiants de comptes (clients, IBAN, marchands) et decrivez le lien suspecte. L'agent IA produit le chemin du graphe, les patterns et les actions. Aucun systeme bancaire reel - POC qui montre la logique de production.",
    inputLabel: "Comptes a analyser",
    placeholderA: "Compte A (ex: CLI-882134 ou FR76...)",
    placeholderB: "Compte B (ex: MRC-44012 ou IBAN BE...)",
    placeholderLink: "Lien suspecte (ex: 14 transactions <72h, 8400 EUR cumules)",
    generate: "Analyser le graphe", generating: "Analyse en cours...",
    outputTitle: "Analyse graphe", emptyHint: "L'analyse s'affiche ici une fois generee.",
    declare: "Declarer TRACFIN", freeze: "Geler comptes", openCase: "Ouvrir dossier KYC",
    declareMock: "Declaration TRACFIN envoyee (mode demo, pas de connexion ERMES reelle)",
    freezeMock: "Gel transactionnel applique (mode demo, pas de connexion core banking reelle)",
    caseMock: "Dossier KYC ouvert dans le CRM (mode demo, pas de connexion Salesforce reelle)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC - aucune connexion core banking, aucun graphe Neo4j reel. L'IA invente le chemin pour la demonstration.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " - fraud detection by graph",
    desc: "Enter two account IDs (clients, IBAN, merchants) and describe the suspected link. The AI agent produces the graph path, patterns and actions. No real banking system - POC showing the production logic.",
    inputLabel: "Accounts to analyze",
    placeholderA: "Account A (e.g. CLI-882134 or FR76...)",
    placeholderB: "Account B (e.g. MRC-44012 or IBAN BE...)",
    placeholderLink: "Suspected link (e.g. 14 transactions <72h, 8400 EUR cumulated)",
    generate: "Analyze the graph", generating: "Analyzing...",
    outputTitle: "Graph analysis", emptyHint: "The analysis will appear here once generated.",
    declare: "File SAR/FinCEN", freeze: "Freeze accounts", openCase: "Open KYC case",
    declareMock: "SAR filed (demo mode, no real FinCEN/Tracfin connection)",
    freezeMock: "Transactional freeze applied (demo mode, no real core banking connection)",
    caseMock: "KYC case opened in CRM (demo mode, no real Salesforce connection)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC - no core banking connection, no real Neo4j graph. The AI invents the path for demonstration.",
  };

  async function generate() {
    setError(""); setOutput(""); setModel(""); setStaticMode(false);
    if (!accountA.trim() || !accountB.trim()) {
      setError(lang === "fr" ? "Entrez les deux identifiants de comptes." : "Enter both account IDs.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountA, accountB, link, lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setOutput(j.mockOutput || ""); setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setOutput(j.output || ""); setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #1A0510; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        @media (max-width: 768px) { .demo-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          {"<- "}{t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#1A0510" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#1A0510" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} - <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.inputLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <input className="wk-input" value={accountA} onChange={(e) => setAccountA(e.target.value)} placeholder={t.placeholderA} />
              <input className="wk-input" value={accountB} onChange={(e) => setAccountB(e.target.value)} placeholder={t.placeholderB} />
              <textarea className="wk-input" value={link} onChange={(e) => setLink(e.target.value)} placeholder={t.placeholderLink} rows={4} style={{ resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "* " + t.generating : "+ " + t.generate}
            </button>
            {error && <div style={{ marginTop: 12, color: "#F87171", fontSize: 13, padding: "8px 12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: output ? "#22C55E" : PAL.txt3 }} />
                {t.outputTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!output ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }} />
            )}

            {output && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.declareMock)}>{t.declare}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.freezeMock)}>{t.freeze}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.caseMock)}>{t.openCase}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: PAL.surface, border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.4)" }}>
          {"v "}{toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}
