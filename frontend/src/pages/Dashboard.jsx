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
  { id: "scam",     icon: "🎯", label: "SCAM RADAR",        component: <ScamRadar />       },
  { id: "behavior", icon: "📊", label: "BEHAVIOR UNIT",     component: <BehaviorMonitor /> },
  { id: "news",     icon: "📰", label: "FACT CHECKER",      component: <FakeNewsChecker /> },
  { id: "loan",     icon: "⚖️", label: "LOAN AUDITOR",      component: <LoanRiskScanner /> },
  { id: "phishing", icon: "🎣", label: "PHISH SCAN",        component: <PhishingDetector /> },
  { id: "threat",   icon: "🔎", label: "CORE ANALYZER",     component: <ThreatAnalyzer />  },
];

export default function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "scam");
  const [sessionLogs, setSessionLogs] = useState([]);
  const [caseId, setCaseId] = useState("");

  useEffect(() => {
    // Generate ID once on mount if not exists
    const newId = `CASE-${Math.floor(Math.random() * 100000).toString(16).toUpperCase()}`;
    setCaseId(newId);
    
    const initialLogs = [
      `[SYS] INITIALIZING FORENSIC ENVIRONMENT...`,
      `[SYS] CASE_ID: ${newId} LOADED`,
      `[SEC] ENCRYPTION_LAYER: AES-256 ACTIVE`,
      `[NET] PROXY_STATUS: SECURE`,
      `[MSG] SELECT MODULE TO BEGIN ANALYSIS`
    ];
    setSessionLogs(initialLogs);

    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      setSessionLogs(prev => [...prev, `[USER] AUTO-NAVIGATED TO ${location.state.tab.toUpperCase()}`]);
    }
    animatePageLoad(".tab-btn");
  }, [location.state]); // Removed caseId to prevent loop

  const activeComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="workstation-root blueprint-overlay">
      <Forensic3DScene isBackground={true} />
      
      <div className="workstation-layout">
        <div className="workstation-sidebar">
          <div className="sidebar-header mono">
            <div className="case-title">FORENSIC_DASHBOARD</div>
            <div className="case-id text-cyan">{caseId}</div>
          </div>

          <div className="tabs-column">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-item mono ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSessionLogs(prev => [...prev.slice(-10), `[EXEC] SWITCHING_TO_MODULE: ${tab.label}`]);
                }}
              >
                <span className="tab-indicator"></span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="system-logs mono">
              {sessionLogs.map((log, i) => (
                <div key={i} className="log-entry">{log}</div>
              ))}
              <div className="log-entry cursor">_</div>
            </div>
          </div>
        </div>

        <div className="workstation-main">
          <div className="main-header mono">
            <div className="header-meta">
              <span className="label">MODULE_STATUS:</span> 
              <span className="value text-green">ACTIVE_STABLE</span>
            </div>
            <div className="header-meta">
              <span className="label">UPTIME:</span> 
              <span className="value">00:14:22:04</span>
            </div>
          </div>

          <div className="forensic-container">
            {activeComponent}
          </div>
        </div>
      </div>
    </div>
  );
}