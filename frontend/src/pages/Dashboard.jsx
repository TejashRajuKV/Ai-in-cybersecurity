import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { animatePageLoad }  from "../animations/loadingAnimation";
import ScamRadar        from "../modules/ScamRadar";
import BehaviorMonitor  from "../modules/BehaviorMonitor";
import FakeNewsChecker  from "../modules/FakeNewsChecker";
import LoanRiskScanner  from "../modules/LoanRiskScanner";
import PhishingDetector from "../modules/PhishingDetector";
import ThreatAnalyzer   from "../modules/ThreatAnalyzer";
import Forensic3DScene  from "../components/Forensic3DScene";
import "../styles/dashboard.css";

const TABS = [
  { id: "scam",     icon: "🎯", label: "Scam Radar",        component: <ScamRadar />       },
  { id: "behavior", icon: "📊", label: "Behavior Monitor",  component: <BehaviorMonitor /> },
  { id: "news",     icon: "📰", label: "Fake News",         component: <FakeNewsChecker /> },
  { id: "loan",     icon: "⚠️", label: "Loan Risk",         component: <LoanRiskScanner /> },
  { id: "phishing", icon: "🎣", label: "Phishing Link",     component: <PhishingDetector /> },
  { id: "threat",   icon: "🔎", label: "Threat Analyzer",   component: <ThreatAnalyzer />  },
];

export default function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "scam");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    animatePageLoad(".tab-btn");
  }, [location.state]);

  const activeComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="dashboard-root">
      {/* ── Subtle Background ── */}
      <Forensic3DScene isBackground={true} />

      <div className="dashboard">
        <div className="container">

          {/* ── Minimal Header ── */}
          <div className="dashboard-header-mini">
            <h1 className="mini-title">
              <span className="cyan-text">FORENSIC</span> WORKSTATION
            </h1>
            <div className="status-mono mono">// SYSTEM ACCESS GRANTED · MODULE SELECTION ACTIVE</div>
          </div>


          {/* ── Tabs ── */}
          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── Active Module ── */}
          <div className="module-container">
            {activeComponent}
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              textAlign:  "center",
              padding:    "32px 0",
              fontFamily: "var(--font-mono)",
              fontSize:   "10px",
              color:      "var(--muted)",
              letterSpacing: "2px",
            }}
          >
            CYBERRAKSHAK · ARCTIC THUNDER · AIFI HACKATHON · REVA UNIVERSITY
          </div>

        </div>
      </div>
    </div>
  );
}