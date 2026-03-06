import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Forensic3DScene from "../components/Forensic3DScene";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const stats = [
    { num: "4", label: "AI MODULES", color: "var(--cyan)" },
    { num: "97%+", label: "SCAM ACCURACY", color: "var(--cyan)" },
    { num: "INDIA", label: "FOCUSED DATASET", color: "var(--white)" },
    { num: "REAL", label: "TIME DETECTION", color: "var(--white)", highlight: "REAL" }
  ];

  return (
    <div className="home-root">
      <div className="global-scanline"></div>

      {/* ── SECTION 00: HERO ── */}
      <section className="home-hero">
        <Forensic3DScene isBackground={true} />
        
        <div className="container">
          <div className="eyebrow fade-in mono">
            // AI IN CYBERSECURITY · ARCTIC THUNDER · REVA UNIVERSITY
          </div>
          
          <h1 className="hero-main-title fade-up">
            <span className="cyber">CYBER</span>
            <span className="rakshak-hollow">RAKSHAK</span>
          </h1>

          <p className="hero-desc fade-up">
            Unified AI threat intelligence platform protecting India's digital citizens from scams, misinformation, behavioural anomalies, and predatory financial fraud — in real time.
          </p>

          <div className="hero-actions fade-up">
            <button className="btn-parallelogram" onClick={() => navigate("/dashboard")}>
              <span className="btn-content">⚡ START SCANNING</span>
            </button>
            <button className="btn-outline-cyber" onClick={() => window.open('https://github.com/TejashRajuKV/Ai-in-cybersecurity', '_blank')}>
              VIEW DOCS
            </button>
          </div>

          <div className="stats-row fade-up">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-num" style={{ color: stat.num === 'REAL' ? 'var(--orange)' : stat.color }}>
                   {stat.num}
                </div>
                <div className="stat-label mono">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="scroll-hint fade-in mono">
            <div className="line"></div>
            <span>SCROLL</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 01: PROBLEM STATEMENT ── */}
      <section className="home-problem" id="engine">
        <div className="container">
          <div className="section-label mono">
            <span className="dash"></span> 01 — PROBLEM STATEMENT
          </div>
          
          <h2 className="section-title">
            INDIA'S DIGITAL <br/>
            <span style={{color: 'var(--pink)'}}>SAFETY CRISIS</span>
          </h2>
          
          <p className="section-desc">
            As internet adoption surges across Bharat, so do the threats. Ordinary citizens face sophisticated attacks with no unified shield.
          </p>

          <div className="grid-2-col">
            <div className="threat-card pink fade-up">
              <span className="t-icon">💸</span>
              <div className="mono" style={{fontSize: '10px', color: 'var(--muted)', marginBottom: '16px'}}>THREAT 01 / 04</div>
              <h3 className="t-title">UPI & PHISHING SCAMS</h3>
              <p className="t-desc">
                Fraudsters impersonate banks, government agencies, and e-commerce platforms via fake links, urgent OTP requests, and deepfake calls.
              </p>
              <div className="t-tag pink-text mono" style={{color: 'var(--pink)', borderColor: 'rgba(255, 51, 102, 0.2)'}}>
                ₹1,750 CR LOST IN 2023
              </div>
            </div>

            <div className="threat-card yellow fade-up">
              <span className="t-icon">📡</span>
              <div className="mono" style={{fontSize: '10px', color: 'var(--muted)', marginBottom: '16px'}}>THREAT 02 / 04</div>
              <h3 className="t-title">MISINFORMATION EPIDEMIC</h3>
              <p className="t-desc">
                Fabricated news spreads 6× faster than truth on WhatsApp, triggering mob violence, election manipulation, and mass panic.
              </p>
              <div className="t-tag yellow-text mono" style={{color: 'var(--yellow)', borderColor: 'rgba(255, 204, 0, 0.2)'}}>
                MILLIONS MISLED DAILY
              </div>
            </div>

            <div className="threat-card cyan fade-up">
              <span className="t-icon">🧠</span>
              <div className="mono" style={{fontSize: '10px', color: 'var(--muted)', marginBottom: '16px'}}>THREAT 03 / 04</div>
              <h3 className="t-title">BEHAVIORAL ANOMALIES</h3>
              <p className="t-desc">
                Unusual account patterns and suspicious transactional sequences often indicate organized money laundering or credential theft.
              </p>
              <div className="t-tag cyan-text mono" style={{color: 'var(--cyan)', borderColor: 'rgba(0, 255, 204, 0.2)'}}>
                92% DETECTION RATE
              </div>
            </div>

            <div className="threat-card green fade-up">
              <span className="t-icon">⚖️</span>
              <div className="mono" style={{fontSize: '10px', color: 'var(--muted)', marginBottom: '16px'}}>THREAT 04 / 04</div>
              <h3 className="t-title">PREDATORY LENDING</h3>
              <p className="t-desc">
                Exploitative loan apps bypass regulations, charging 400%+ interest and using illegal harassment tactics for debt recovery.
              </p>
              <div className="t-tag green-text mono" style={{color: 'var(--green)', borderColor: 'rgba(51, 255, 102, 0.2)'}}>
                1,000+ APPS BANNED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02: AI MODULES ── */}
      <section className="home-modules-showcase" id="modules">
        <div className="container">
          <div className="section-label mono">
            <span className="dash"></span> 02 — AI MODULES
          </div>

          <h2 className="section-title">
            FOUR SHIELDS. <br/>
            <span style={{color: 'var(--cyan)'}}>ONE ENGINE.</span>
          </h2>

          <p className="section-desc">
            Each module is a specialized AI pipeline — independently powerful, collectively unstoppable.
          </p>

          <div className="grid-3-col">
            <div className="module-card fade-up" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard", { state: { tab: "scam" } })}>
              <div className="m-label mono">MODULE 01 / 06</div>
              <span className="t-icon">🎯</span>
              <h3 className="m-title">SCAM <span>RADAR</span></h3>
              <p className="t-desc">
                Analyses SMS, WhatsApp messages, and emails for phishing patterns, urgency triggers, and known scam fingerprints.
              </p>
              <div className="m-tags mono">
                <span className="m-tag">TF-IDF NLP</span>
                <span className="m-tag">SCAM.CSV</span>
              </div>
            </div>

            <div className="module-card fade-up" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard", { state: { tab: "behavior" } })}>
              <div className="m-label mono">MODULE 02 / 06</div>
              <span className="t-icon">📊</span>
              <h3 className="m-title">BEHAVIOR <span>MONITOR</span></h3>
              <p className="t-desc">
                Detects unusual account activity and suspicious transaction sequences using Isolation Forest anomaly detection.
              </p>
              <div className="m-tags mono">
                <span className="m-tag">ISOLATION FOREST</span>
                <span className="m-tag">ANOMALY DETECT</span>
              </div>
            </div>

            <div className="module-card fade-up" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard", { state: { tab: "news" } })}>
              <div className="m-label mono">MODULE 03 / 06</div>
              <span className="t-icon">📰</span>
              <h3 className="m-title">FAKE NEWS <span>CHECKER</span></h3>
              <p className="t-desc">
                Cross-references viral claims against training data and linguistic manipulation patterns to detect misinformation.
              </p>
              <div className="m-tags mono">
                <span className="m-tag">BERT-LIKE NLP</span>
                <span className="m-tag">FACT CHECK</span>
              </div>
            </div>

            <div className="module-card fade-up" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard", { state: { tab: "loan" } })}>
              <div className="m-label mono">MODULE 04 / 06</div>
              <span className="t-icon">⚠️</span>
              <h3 className="m-title">LOAN RISK <span>SCANNER</span></h3>
              <p className="t-desc">
                Scores loan applications for predatory lending patterns, interest transparency, and RBI regulatory compliance.
              </p>
              <div className="m-tags mono">
                <span className="m-tag">PERM AUDIT</span>
                <span className="m-tag">RBI COMPLIANT</span>
              </div>
            </div>

            <div className="module-card fade-up" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard", { state: { tab: "phishing" } })}>
              <div className="m-label mono">MODULE 05 / 06</div>
              <span className="t-icon">🎣</span>
              <h3 className="m-title">PHISHING <span>LINK</span></h3>
              <p className="t-desc">
                Real-time scanning of URLs for malicious redirects, shortened link masking, and domain spoofing signatures.
              </p>
              <div className="m-tags mono">
                <span className="m-tag">URL HEURISTICS</span>
                <span className="m-tag">SSL VERIFY</span>
              </div>
            </div>

            <div className="module-card fade-up" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard", { state: { tab: "threat" } })}>
              <div className="m-label mono">MODULE 06 / 06</div>
              <span className="t-icon">🔎</span>
              <h3 className="m-title">THREAT <span>ANALYZER</span></h3>
              <p className="t-desc">
                Unified forensic engine that correlates multi-vector data to provide a comprehensive digital safety score.
              </p>
              <div className="m-tags mono">
                <span className="m-tag">CORE ANALYTICS</span>
                <span className="m-tag">TOTAL RISK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
