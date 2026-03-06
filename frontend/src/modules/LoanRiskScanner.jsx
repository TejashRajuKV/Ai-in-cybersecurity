import { useState } from "react";
import { scoreLoan } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import SecurityShield from "../components/SecurityShield";
import "../styles/modules.css";

const RULES = [
  { key: "too_many_permissions", label: "App requests too many permissions (contacts, SMS, camera)", score: 30 },
  { key: "no_rbi_registration",  label: "No RBI registration found for this lender",               score: 40 },
  { key: "instant_approval",     label: "Claims instant approval with no documents required",       score: 20 },
  { key: "high_interest_rate",   label: "Interest rate exceeds 36% APR",                           score: 25 },
  { key: "not_on_playstore",     label: "App not found on official Google Play Store",              score: 15 },
  { key: "requests_contacts",    label: "App requests access to your contacts list",                score: 20 },
  { key: "requests_sms",         label: "App requests access to your SMS messages",                 score: 20 },
  { key: "requests_location",    label: "App requests continuous location access",                  score: 10 },
  { key: "no_physical_address",  label: "No physical office address provided",                      score: 15 },
  { key: "pressure_tactics",     label: "Uses pressure tactics like limited time offers",           score: 25 },
];

export default function LoanRiskScanner() {
  const [checked,  setChecked]  = useState({});
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

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
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setChecked({});
    setResult(null);
    setError(null);
  };

  // Count checked items
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="module-title">⚠️ Loan Risk Scanner</div>
      <div className="module-desc">
        // Check all features that apply to the loan app you are evaluating
      </div>

      {/* ── Checklist ── */}
      <div className="checklist">
        {RULES.map((rule) => (
          <div
            key={rule.key}
            className={`checklist-item ${checked[rule.key] ? "checked" : ""}`}
            onClick={() => toggleRule(rule.key)}
          >
            <div className="checklist-checkbox">
              {checked[rule.key] && "✓"}
            </div>
            <div className="checklist-text">{rule.label}</div>
            <div className="checklist-score">+{rule.score}</div>
          </div>
        ))}
      </div>

      {/* ── Selected Count ── */}
      <div
        className="mono muted"
        style={{ marginBottom: "16px", fontSize: "11px" }}
      >
        {checkedCount} risk factor{checkedCount !== 1 ? "s" : ""} selected
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn btn-primary"
          onClick={handleScore}
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? "Scoring..." : "⚠️ Calculate Risk Score"}
        </button>
        <button
          className="btn btn-outline"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      {/* ── Security Sentinel Visualization ── */}
      {(loading || result) && (
        <SecurityShield 
            loading={loading} 
            riskScore={result?.confidence || 0}
            checkedFactors={Object.keys(checked).filter(k => checked[k])}
        />
      )}

      {/* ── Loading ── */}
      {loading && <Loader text="PERFORMING SECURITY AUDIT..." />}

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginTop:    "16px",
          padding:      "16px",
          background:   "rgba(255,45,85,0.1)",
          border:       "1px solid rgba(255,45,85,0.3)",
          borderRadius: "6px",
          color:        "var(--red)",
          fontSize:     "13px"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Result ── */}
      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
