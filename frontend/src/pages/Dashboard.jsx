import { useState, useEffect } from "react";
import { animatePageLoad }  from "../animations/loadingAnimation";
import ScamRadar        from "../modules/ScamRadar";
import BehaviorMonitor  from "../modules/BehaviorMonitor";
import FakeNewsChecker  from "../modules/FakeNewsChecker";
import LoanRiskScanner  from "../modules/LoanRiskScanner";
import "../styles/dashboard.css";

const TABS = [
  { id: "scam",     icon: "🎯", label: "Scam Radar",        component: <ScamRadar />       },
  { id: "behavior", icon: "📊", label: "Behavior Monitor",  component: <BehaviorMonitor /> },
  { id: "news",     icon: "📰", label: "Fake News",         component: <FakeNewsChecker /> },
  { id: "loan",     icon: "⚠️", label: "Loan Risk",         component: <LoanRiskScanner /> },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("scam");

  useEffect(() => {
    animatePageLoad(".tab-btn");
  }, []);

  const activeComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="dashboard">
      <div className="container">

        {/* ── Header ── */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            🛡️ <span style={{ color: "var(--cyan)" }}>CyberRakshak</span> Dashboard
          </h1>
          <div className="dashboard-subtitle">
            // SELECT A MODULE TO BEGIN SCANNING
          </div>
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
  );
}