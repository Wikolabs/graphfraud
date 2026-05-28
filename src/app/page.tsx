export default function Home() {
  return (
    <main style={{ fontFamily: "var(--font-body)" }}>
      {/* NAVBAR */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #ffe4e6", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 50 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "#f43f5e" }}>GraphFraud</span>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="#features" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem" }}>Fonctionnalités</a>
          <a href="#how" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem" }}>Comment ça marche</a>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" style={{ background: "#f43f5e", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Démo gratuite</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "#f43f5e", color: "#fff", borderRadius: "999px", padding: "0.4rem 1.2rem", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>Graph Neural Network · Fraude réseau</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, color: "#0f172a", marginBottom: "1.5rem", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
          La fraude organisée<br /><span style={{ color: "#f43f5e" }}>ne se cache plus dans votre graphe.</span>
        </h1>
        <p style={{ color: "#475569", fontSize: "1.15rem", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Analyse de graphes transactionnels GNN — détection de communautés frauduleuses et d&apos;anneaux de fraude organisée.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" style={{ background: "#f43f5e", color: "#fff", padding: "0.85rem 2rem", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>Demander une démo</button>
          <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20GraphFraud%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" style={{ background: "#25d366", color: "#fff", padding: "0.85rem 2rem", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>WhatsApp</a>
        </div>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[{ value: "+95%", label: "détection réseau" }, { value: "<1s", label: "analyse graphe" }, { value: "GNN", label: "propriétaire" }, { value: "Temps réel", label: "traitement" }].map((m) => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#f43f5e" }}>{m.value}</div>
              <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: "0.75rem" }}>Ce que GraphFraud détecte</h2>
          <p style={{ color: "#64748b", textAlign: "center", marginBottom: "3rem", fontSize: "1rem" }}>Des patterns de fraude organisée invisibles aux systèmes classiques.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🕸️", title: "Analyse de graphe transactionnel", desc: "Chaque transaction crée un lien dans le graphe. Les patterns de fraude organisée — mules, rings, burst fraud — sont détectés par leur topologie." },
              { icon: "👥", title: "Détection de communautés", desc: "Les algorithmes de clustering identifient les groupes d'entités qui collaborent pour frauder, même sans transaction directe entre elles." },
              { icon: "📊", title: "Scoring de réseau", desc: "Chaque nœud reçoit un score basé sur son voisinage : un compte légitime lié à plusieurs fraudeurs voit son risque augmenter automatiquement." },
            ].map((f) => (
              <div key={f.title} style={{ background: "#fff1f2", borderRadius: "16px", padding: "2rem", border: "1px solid #ffe4e6" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", marginBottom: "0.75rem" }}>{f.title}</h3>
                <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.95rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "5rem 2rem", background: "#fff1f2" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: "0.75rem" }}>Comment ça marche</h2>
          <p style={{ color: "#64748b", textAlign: "center", marginBottom: "3rem", fontSize: "1rem" }}>Intégration en 3 étapes, résultats dès la première semaine.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              { step: "01", title: "Ingestion des transactions", desc: "Feed en temps réel via Kafka/Kinesis ou batch quotidien. Chaque transaction devient un arc dans le graphe de relations." },
              { step: "02", title: "Construction et analyse du graphe", desc: "Le GNN s'entraîne sur vos données historiques et met à jour les scores en continu à chaque nouvelle transaction." },
              { step: "03", title: "Détection et alertes", desc: "Les communautés suspectes et les nœuds à risque élevé déclenchent des alertes avec visualisation du graphe causal pour l'équipe fraude." },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", background: "#fff", borderRadius: "16px", padding: "1.75rem", border: "1px solid #ffe4e6" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#f43f5e", minWidth: "3rem" }}>{s.step}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", marginBottom: "0.5rem" }}>{s.title}</h3>
                  <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.95rem" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", background: "#f43f5e", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 800, color: "#fff", marginBottom: "1rem" }}>Exposez les réseaux frauduleux dès aujourd&apos;hui</h2>
        <p style={{ color: "#ffe4e6", fontSize: "1.1rem", marginBottom: "2rem" }}>Analyse pilote sur vos 3 derniers mois de transactions.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" style={{ background: "#fff", color: "#f43f5e", padding: "0.9rem 2.25rem", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>Planifier une démo</button>
          <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20GraphFraud%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" style={{ background: "#25d366", color: "#fff", padding: "0.9rem 2.25rem", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>WhatsApp</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "2.5rem 2rem", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#fff", marginBottom: "0.5rem" }}>GraphFraud by Wikolabs</div>
        <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          <a href="mailto:team@wikolabs.com" style={{ color: "#94a3b8", textDecoration: "none" }}>team@wikolabs.com</a>
          {" · "}
          <a href="https://wikolabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}>wikolabs.com</a>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.5rem", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:team@wikolabs.com" style={{ color: "#94a3b8", textDecoration: "none" }}>team@wikolabs.com</a>
          <span>·</span>
          <a href="tel:+261386626100" style={{ color: "#94a3b8", textDecoration: "none" }}>+261 38 66 261 00</a>
          <span>·</span>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}>Prendre RDV</button>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#475569" }}>© 2026 Wikolabs. Tous droits réservés.</div>
      </footer>
    </main>
  );
}
