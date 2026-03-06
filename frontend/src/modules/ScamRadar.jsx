import { useState } from "react";
import { analyzeScam } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import "../styles/modules.css";

export default function ScamRadar() {
  const [message,  setMessage]  = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeScam(message);
      setResult(data);
    } catch (err) {
      setError("Failed to connect to backend. Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError(null);
  };

  // Sample scam messages for demo
  const samples = [
    "Your KYC will be suspended. Update immediately to avoid account freeze.",
    "UPI collect request pending. Approve now or your account will be blocked.",
    "Digital arrest notice issued. Pay fine immediately to avoid legal action.",
  ];

  return (
    <div>
      <div className="module-title">🎯 Scam Radar</div>
      <div className="module-desc">
        // Paste a suspicious message to detect scam patterns
      </div>

      {/* ── Sample Buttons ── */}
      <div style={{ marginBottom: "12px" }}>
        <span
          className="mono muted"
          style={{ display: "block", marginBottom: "8px" }}
        >
          // Quick demo samples:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {samples.map((s, i) => (
            <button
              key={i}
              className="btn btn-outline"
              style={{ fontSize: "11px", padding: "6px 12px" }}
              onClick={() => setMessage(s)}
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ── */}
      <div className="input-wrap">
        {loading && <div className="scanline" />}
        <textarea
          className="input"
          placeholder="Paste suspicious message here...
Example: Your KYC will be suspended. Send OTP immediately."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || !message.trim()}
          style={{ flex: 1 }}
        >
          {loading ? "Analyzing..." : "🔍 Analyze Message"}
        </button>
        <button
          className="btn btn-outline"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && <Loader text="SCANNING MESSAGE..." />}

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginTop:   "16px",
          padding:     "16px",
          background:  "rgba(255,45,85,0.1)",
          border:      "1px solid rgba(255,45,85,0.3)",
          borderRadius: "6px",
          color:       "var(--red)",
          fontSize:    "13px"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Result ── */}
      {result && !loading && (
        <ResultPanel result={result} />
      )}
    </div>
  );
}
