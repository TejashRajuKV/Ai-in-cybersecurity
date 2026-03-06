import { useState, useEffect } from "react";
import { scoreLoan } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import SecurityShield from "../components/SecurityShield";
import "../styles/modules.css";

const RULES = [
  { key: "too_many_permissions", label: "APP_REQUESTS_EXCESSIVE_PERMISSIONS", score: 30 },
  { key: "no_rbi_registration",  label: "NO_RBI_REGISTRATION_DETECTED",      score: 40 },
  { key: "instant_approval",     label: "CLAIMS_INSTANT_APPROVAL_SCAM",      score: 20 },
  { key: "high_interest_rate",   label: "INTEREST_EXCEEDS_LEGAL_CAP",        score: 25 },
  { key: "not_on_playstore",     label: "UNOFFICIAL_DISTRIBUTION_SOURCE",    score: 15 },
  { key: "requests_contacts",    label: "DATA_HARVESTING: CONTACT_LIST",     score: 20 },
  { key: "requests_sms",         label: "DATA_HARVESTING: SMS_MESSAGES",     score: 20 },
  { key: "no_physical_address",  label: "ANONYMOUS_LENDER_ENTITY",           score: 15 },
  { key: "pressure_tactics",     label: "PSYCHOLOGICAL_PRESSURE_TACTICS",   score: 25 },
];

export default function LoanRiskScanner() {
  const [checked,  setChecked]  = useState({});
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    setModuleId(`UNIT-${Math.floor(Math.random() * 900 + 100)}-LR`);
  }, []);

  const toggleRule = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleScore = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const appData = Object.fromEntries(
        RULES.map((r) => [r.key, !!checked[r.key]])
      );
      const data = await scoreLoan(appData);
      setResult(data);
    } catch (err) {
      setError("Audit failed. Regulatory dataset inaccessible.");
    } finally {
      setLoading(false);
    }
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="forensic-module">
      {/* ── Technical Header ── */}
      <div className="module-header-technical">
        <div className="module-id-label mono">// {moduleId} // REGULATORY.AUDIT</div>
        <h2 className="module-technical-title">LOAN RISK <span className="text-cyan">AUDITOR</span></h2>
        <div className="module-desc mono">PREDATORY_LENDING_DETECTION_CORE_ACTIVE</div>
      </div>

      {/* ── Checklist ── */}
      <div className="checklist-technical">
        {RULES.map((rule) => (
          <div
            key={rule.key}
            className={`checklist-item-forensic ${checked[rule.key] ? "checked" : ""}`}
            onClick={() => toggleRule(rule.key)}
          >
            <div className="check-box mono">{checked[rule.key] ? "[X]" : "[ ]"}</div>
            <div className="check-text mono">{rule.label}</div>
            <div className="check-score mono">+{rule.score}</div>
          </div>
        ))}
      </div>

      {/* ── Selected Count ── */}
      <div className="module-id-label mono" style={{ margin: "24px 0" }}>
        // {checkedCount} RISK_FACTORS_FLAGGED
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn-forensic-scan"
          onClick={handleScore}
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? "AUDITING_COMPLIANCE..." : "[ INITIATE_SECURITY_AUDIT ]"}
        </button>
        <button
          className="btn-demo"
          style={{ padding: "0 24px" }}
          onClick={() => { setChecked({}); setResult(null); }}
        >
          RESET
        </button>
      </div>

      {/* ── Visualizations ── */}
      {(loading || result) && (
        <SecurityShield 
            loading={loading} 
            riskScore={result?.confidence || 0}
            checkedFactors={Object.keys(checked).filter(k => checked[k])}
        />
      )}

      {loading && <Loader text="VALIDATING_RBI_COMPLIANCE_PARAMETERS..." />}

      {error && <div className="error-box mono">!! CRITICAL_ERROR: {error}</div>}

      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
