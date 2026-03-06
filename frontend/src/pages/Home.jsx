import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const forensicModules = [
    { icon: "🎯", title: "SCAM_RADAR", desc: "NEURAL_NET ANALYSIS OF FRAUDULENT UPI & KYC REQUESTS.", color: "var(--cyan)" },
    { icon: "🧠", title: "BEHAVIOR_UNIT", desc: "ANOMALY DETECTION ON HIGH-RISK FINANCIAL PATTERNS.", color: "var(--pink)" },
    { icon: "📰", title: "TRUTH_ENGINE", desc: "REAL-TIME DEBUNKING OF MALICIOUS MISINFORMATION.", color: "var(--green)" },
    { icon: "⚖️", title: "RISK_AUDITOR", desc: "PREDATORY LOAN APP SCORING & RBI COMPLIANCE.", color: "var(--yellow)" }
  ];

  return (
    <div className="home-root">
      <div className="container">

        {/* ── High Intensity Hero ── */}
        <section className="home-hero">
          <div className="eyebrow fade-in">
            [ SYSTEM_STATUS: READY // ENCRYPTION_STRENGTH: MAXIMUM ]
          </div>
          
          <h1 className="hero-main-title fade-up">
            <span className="cyber glitch-text" data-text="CYBER">CYBER</span>
            <span className="rakshak">RAKSHAK</span>
          </h1>

          <p className="hero-desc fade-up">
            THE WORLD'S MOST ADVANCED AI FORENSIC ENGINE. <br/>
            PROTECTING THE DIGITAL FRONTIER AGAINST SCAMS, <br/>
            FAKE NEWS, AND PREDATORY SYSTEM THREATS.
          </p>

          <div className="hero-actions fade-up">
            <button className="btn-glow" onClick={() => navigate("/dashboard")}>
              INITIALIZE_INTERFACE
            </button>
          </div>

          <div className="stats-grid fade-up">
            <div className="stat">
              <span className="stat-num">05</span>
              <span className="stat-label mono">AI_CORES_ACTIVE</span>
            </div>
            <div className="stat">
              <span className="stat-num">98%</span>
              <span className="stat-label mono">SCAN_ACCURACY</span>
            </div>
            <div className="stat">
              <span className="stat-num">IMS</span>
              <span className="stat-label mono">LATENCY_STRENGTH</span>
            </div>
          </div>
        </section>

        {/* ── Forensic Module Grid ── */}
        <section className="home-modules">
          {forensicModules.map((m, i) => (
            <div key={i} className="forensic-card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="f-icon">{m.icon}</span>
              <h3 className="f-title" style={{ color: m.color }}>{m.title}</h3>
              <p className="f-desc mono">{m.desc}</p>
              <div className="card-glitch"></div>
            </div>
          ))}
        </section>

      </div>

      {/* ── Live System Ticker ── */}
      <div className="status-ticker">
        <div className="ticker-content mono">
          // THREAT_VECTORS_NEUTRALIZED: 1.2M // GLOBAL_SECURITY_PULSE: STABLE // SCANNING_PACKETS: 14.5TB/s // DATABASE_VERSION: V2.1.0_CYBERPUNK //
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-top: 80px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-num {
          font-size: 40px;
          font-weight: 900;
          color: var(--white);
        }
        .stat-label {
          font-size: 9px;
          color: var(--muted);
          letter-spacing: 2px;
          margin-top: 5px;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
      `}</style>
    </div>
  );
}

