import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animatePageLoad } from "../animations/loadingAnimation";
import "../styles/global.css";

export default function Home() {
  const navigate    = useNavigate();
  const contentRef  = useRef(null);

  useEffect(() => {
    animatePageLoad(".hero-item");
  }, []);

  const features = [
    {
      icon:  "🎯",
      title: "Scam Radar",
      desc:  "Detect fraudulent UPI, KYC and digital arrest scam messages using NLP",
      color: "var(--cyan)",
    },
    {
      icon:  "📊",
      title: "Behavior Monitor",
      desc:  "Detect unusual account activity using Isolation Forest anomaly detection",
      color: "var(--green)",
    },
    {
      icon:  "📰",
      title: "Fake News Checker",
      desc:  "Classify news headlines as real or fake using machine learning",
      color: "var(--orange)",
    },
    {
      icon:  "⚠️",
      title: "Loan Risk Scanner",
      desc:  "Score loan apps for predatory lending patterns and RBI compliance",
      color: "var(--yellow)",
    },
  ];

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <div className="container">

        {/* ── Hero ── */}
        <div
          style={{
            textAlign:  "center",
            padding:    "80px 0 60px",
          }}
        >
          {/* Eyebrow */}
          <div
            className="hero-item mono muted"
            style={{ marginBottom: "16px", letterSpacing: "4px" }}
          >
            // AI IN CYBERSECURITY · ARCTIC THUNDER · REVA UNIVERSITY
          </div>

          {/* Title */}
          <h1
            className="hero-item"
            style={{
              fontSize:      "clamp(40px, 7vw, 80px)",
              fontWeight:    "800",
              letterSpacing: "-2px",
              marginBottom:  "16px",
              lineHeight:    "1.0",
            }}
          >
            CYBER
            <span style={{ color: "var(--cyan)" }}>RAKSHAK</span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-item"
            style={{
              fontSize:      "16px",
              color:         "var(--text)",
              maxWidth:      "520px",
              margin:        "0 auto 40px",
              lineHeight:    "1.7",
            }}
          >
            Unified AI platform protecting Indian internet users from
            scams, fake news, suspicious behavior and predatory loan apps.
          </p>

          {/* CTA Button */}
          <button
            className="hero-item btn btn-primary"
            style={{ fontSize: "15px", padding: "14px 36px" }}
            onClick={() => navigate("/dashboard")}
          >
            🛡️ Start Scanning
          </button>

          {/* Stats */}
          <div
            className="hero-item"
            style={{
              display:       "flex",
              gap:           "48px",
              justifyContent: "center",
              marginTop:     "60px",
              flexWrap:      "wrap",
            }}
          >
            {[
              { num: "4",      label: "AI Modules"       },
              { num: "97%+",   label: "Scam Accuracy"    },
              { num: "India",  label: "Focused Dataset"  },
              { num: "Real",   label: "Time Detection"   },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize:   "28px",
                    fontWeight: "800",
                    color:      "var(--white)",
                  }}
                >
                  {stat.num}
                </div>
                <div className="mono muted" style={{ fontSize: "10px", letterSpacing: "2px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div
          style={{
            display:               "grid",
            gridTemplateColumns:   "repeat(auto-fit, minmax(240px, 1fr))",
            gap:                   "16px",
            paddingBottom:         "80px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="hero-item glass-card"
              style={{
                cursor:     "pointer",
                transition: "transform 0.2s, border-color 0.2s",
                borderColor: "var(--border)",
              }}
              onClick={() => navigate("/dashboard")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform   = "translateY(-4px)";
                e.currentTarget.style.borderColor = f.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform   = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize:     "16px",
                  marginBottom: "8px",
                  color:        f.color,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", lineHeight: "1.6" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
