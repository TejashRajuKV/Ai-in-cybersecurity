import { useState, useEffect } from "react";
import { analyzeScam } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import GuardianAlert from "../components/GuardianAlert";
import Loader from "../components/Loader";
import { loadGuardian, sendGuardianAlert } from "../hooks/useGuardian";
import "../styles/modules.css";

export default function ScamRadar() {
  const [message,  setMessage]  = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [moduleId, setModuleId] = useState("");
  const [guardianAlert, setGuardianAlert] = useState(null);

  useEffect(() => {
    setModuleId(`UNIT-${Math.floor(Math.random() * 900 + 100)}-SR`);
  }, []);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeScam(message);
      setResult(data);

      // ── Guardian Alert on critical risk ──────────────────
      const risk = data?.confidence ?? data?.risk_score ?? 0;
      if (risk >= 90) {
        const guardian = loadGuardian();
        if (guardian) {
          const alertResult = await sendGuardianAlert({
            guardian,
            module:        "SCAM_RADAR",
            riskScore:     risk,
            suspectMessage: message,
          });
          if (alertResult.success) setGuardianAlert(alertResult.payload);
        }
      }
      // ─────────────────────────────────────────────────────

    } catch (err) {
      setError("Pattern analysis failed. Metadata signature missing.");
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    "Your KYC will be suspended. Update immediately to avoid account freeze.",
    "UPI collect request pending. Approve now or your account will be blocked.",
    "Digital arrest notice issued. Pay fine immediately to avoid legal action.",
  ];

  return (
    <div className="forensic-module">
      {/* ── Guardian Alert Modal ── */}
      <GuardianAlert alert={guardianAlert} onDismiss={() => setGuardianAlert(null)} />

      {/* ── Technical Header ── */}
      <div className="module-header-technical">
        <div className="module-id-label mono">// {moduleId} // PATTERN.PROBE</div>
        <h2 className="module-technical-title">SCAM <span className="text-cyan">RADAR</span></h2>
        <div className="module-desc mono">SOCIAL_ENGINEERING_SCANNER_V4_ACTIVE</div>
      </div>

      {/* ── Demo Controls ── */}
      <div className="demo-controls">
        {samples.map((s, i) => (
          <button key={i} className="btn-demo" onClick={() => setMessage(s)}>LOAD_SIGNATURE_0{i+1}</button>
        ))}
      </div>

      {/* ── Technical Input ── */}
      <div className="forensic-input-group">
        <span className="forensic-label mono">// SUSPICIOUS_MESSAGE_BODY</span>
        <div className="input-bracket-wrap">
          <textarea
            className="forensic-input"
            rows={5}
            placeholder="PASTE SMS, WHATSAPP, OR EMAIL CONTENT FOR PATTERN SCANNING..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          className="btn-forensic-scan"
          onClick={handleAnalyze}
          disabled={loading || !message.trim()}
          style={{ flex: 1 }}
        >
          {loading ? "ANALYZING_PATTERNS..." : "[ LAUNCH_SCAM_PROBE ]"}
        </button>
        <button
          className="btn-demo"
          style={{ padding: "0 24px" }}
          onClick={() => { setMessage(""); setResult(null); }}
        >
          CLEAR
        </button>
      </div>

      {loading && <Loader text="ISOLATING_THREAT_SIGNATURES..." />}

      {error && <div className="error-box mono">!! CRITICAL_ERROR: {error}</div>}

      {result && !loading && (
        <ResultPanel result={result} />
      )}
    </div>
  );
}
