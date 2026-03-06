import { useState } from "react";
import { analyzeNews } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import TruthGauge from "../components/TruthGauge";
import VerdictStamp from "../components/VerdictStamp";
import "../styles/modules.css";

export default function FakeNewsChecker() {
  const [text,    setText]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeNews(text);
      setResult(data);
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    "Government gives free Rs 10000 to all Aadhaar card holders. Click link to claim now.",
    "RBI raises repo rate by 25 basis points to control inflation in India.",
    "WhatsApp will shut down next week unless you forward this message to 10 people.",
  ];

  return (
    <div>
      <div className="module-title">📰 Fake News Checker</div>
      <div className="module-desc">
        // Paste a news headline or message to verify if it is real or fake
      </div>

      {/* ── Samples ── */}
      <div style={{ marginBottom: "12px" }}>
        <span className="mono muted" style={{ display: "block", marginBottom: "8px" }}>
          // Quick demo samples:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {samples.map((s, i) => (
            <button
              key={i}
              className="btn btn-outline"
              style={{ fontSize: "11px", padding: "6px 12px" }}
              onClick={() => setText(s)}
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ── */}
      <textarea
        className="input"
        placeholder="Paste news headline or message here...
Example: Government gives free Rs 10000 to all citizens."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          style={{ flex: 1 }}
        >
          {loading ? "Checking..." : "📰 Check News"}
        </button>
        <button
          className="btn btn-outline"
          onClick={() => { setText(""); setResult(null); }}
        >
          Clear
        </button>
      </div>

      {/* ── Truth Gauge Visualization ── */}
      {(loading || result) && (
        <TruthGauge 
          confidence={result?.confidence || 50} 
          loading={loading} 
        />
      )}

      {/* ── Loading ── */}
      {loading && <Loader text="AUTHENTICATING SOURCES..." />}

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

      {/* ── Result with Verdict Stamp ── */}
      {result && !loading && (
        <div style={{ position: "relative" }}>
          <VerdictStamp label={result.label} />
          <ResultPanel result={result} />
        </div>
      )}
    </div>
  );
}
