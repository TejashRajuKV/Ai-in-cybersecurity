import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Forensic3DScene   from "../components/Forensic3DScene";
import NeuralParticles   from "../components/NeuralParticles";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const stats = [
    { num: "06",     label: "ACTIVE FORENSIC MODULES", color: "var(--cyan)" },
    { num: "98.4%",  label: "DETECTION ACCURACY RATE",  color: "var(--cyan)" },
    { num: "BHARAT", label: "REGIONAL DATASET ORIGIN",  color: "var(--white)" },
    { num: "LIVE",   label: "THREAT MONITOR STATUS",    color: "var(--green)" }
  ];

  return (
    <div className="home-root blueprint-overlay">
      <div className="corner-decor top-left"></div>
      <div className="corner-decor top-right"></div>
      <div className="corner-decor bottom-left"></div>
      <div className="corner-decor bottom-right"></div>

      {/* ── SECTION 00: DOSSIER HERO ── */}
      <section className="home-hero dossier-layout">
        <Forensic3DScene isBackground={true} />
        <NeuralParticles />
        
        <div className="container">
          <div className="technical-index mono fade-in">
            INDEX-REF: CYBER-RAKSHAK-V1.1 // S-734
          </div>
          
          <h1 className="hero-main-title technical-style fade-up">
            <span className="case-title">CYBER</span>
            <span className="case-name">RAKSHAK</span>
          </h1>

          <div className="dossier-meta mono fade-up">
            CLASSIFICATION: <span className="red-text">TOP SECRET</span> // 
            PROTOCOL: ULTIMATE DEFENSE // 
            ORIGIN: REVA UNIVERSITY
          </div>

          <p className="hero-desc dossier-desc fade-up">
            A unified digital forensic intelligence infrastructure designed to identify, analyze, and neutralize cyber-threats targeting the Indian digital ecosystem.
          </p>

          <div className="hero-actions dossier-actions fade-up">
            <button className="btn-technical" onClick={() => navigate("/dashboard")}>
              <span className="bracket">[</span> OPEN CASE FILE <span className="bracket">]</span>
            </button>
            <button className="btn-outline-technical" onClick={() => document.getElementById('modules').scrollIntoView({ behavior: 'smooth' })}>
              VIEW_FORENSIC_SHIELDS
            </button>
          </div>

          <div className="stats-row technical-grid fade-up">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card technical-card">
                <div className="stat-num mono" style={{ color: stat.color }}>
                   {stat.num}
                </div>
                <div className="stat-label mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 01: THREAT LOGS ── */}
      <section className="home-problem technical-section" id="engine">
        <div className="container">
          <div className="section-label-technical mono">
            <span className="idx">IDX-001</span> // THREAT VECTOR ANALYSIS
          </div>
          
          <h2 className="section-title technical-h2">
            CRITICAL THREAT <br/>
            <span className="amber-text">INTEL REPORT</span>
          </h2>
          
          <div className="grid-2-col">
            <div className="threat-card report-card fade-up">
              <div className="report-header mono">
                <span className="status-bit red"></span> ALERT: V-PHISH_01
              </div>
              <h3 className="t-title">FINANCIAL PHISHING</h3>
              <p className="t-desc">
                Organized UPI fraud syndicates exploiting social engineering to drain digital wallets across Bharat.
              </p>
              <div className="t-meta mono"> IMPACT: HIGH // LOSS CAP: ₹1,750 CR</div>
            </div>

            <div className="threat-card report-card fade-up">
              <div className="report-header mono">
                <span className="status-bit amber"></span> ALERT: M-INFO_02
              </div>
              <h3 className="t-title">WEAPONIZED INFO</h3>
              <p className="t-desc">
                Viral misinformation clusters designed to destabilize social cohesion via rapid-response WhatsApp networks.
              </p>
              <div className="t-meta mono"> VELOCITY: EXTREME // RISK: SOCIAL</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02: FORENSIC MODULES ── */}
      <section className="home-modules-showcase technical-section" id="modules">
        <div className="container">
          <div className="section-label-technical mono">
            <span className="idx">IDX-002</span> // AI ENGINE CAPABILITIES
          </div>

          <h2 className="section-title technical-h2">
            SIX ACTIVE <br/>
            <span className="cyan-text">FORENSIC SHIELDS</span>
          </h2>

          <div className="grid-3-col">
            {[
              { id: "scam", title: "SCAM RADAR", desc: "NLP-driven pattern recognition for message-based fraud.", tags: ["TF-IDF", "NLP"] },
              { id: "behavior", title: "BEHAVIOR MONITOR", desc: "Sequence anomaly detection for user interactions.", tags: ["ISO FOREST", "SVM"] },
              { id: "news", title: "FAKE NEWS", desc: "Stance detection and credibility cross-referencing.", tags: ["BERT", "STANCE"] },
              { id: "loan", title: "LOAN SCANNER", desc: "RBI regulatory compliance and predatory audit.", tags: ["AUDIT", "COMPLY"] },
              { id: "phishing", title: "PHISHING LINK", desc: "Real-time URL heuristic and redirect mapping.", tags: ["HEURISTIC", "WHOIS"] },
              { id: "threat", title: "THREAT ANALYZER", desc: "Unified correlation engine for risk scoring.", tags: ["FUSION", "CORE"] }
            ].map((m, i) => (
              <div key={i} className="module-card dossier-card fade-up" onClick={() => navigate("/dashboard", { state: { tab: m.id } })}>
                <div className="card-top mono">#MOD-0{i+1}</div>
                <h3 className="m-title">{m.title}</h3>
                <p className="t-desc">{m.desc}</p>
                <div className="m-tags mono">
                  {m.tags.map(tag => <span key={tag} className="m-tag">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
