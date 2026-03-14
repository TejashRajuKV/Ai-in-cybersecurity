import { useState, useEffect } from "react";
import { analyzeToxicity } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import ConfidenceBar from "../components/ConfidenceBar";
import Loader from "../components/Loader";
import "../styles/modules.css";

export default function ToxicityShield() {
  const [message,  setMessage]  = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    setModuleId(`UNIT-${Math.floor(Math.random() * 900 + 100)}-TX`);
  }, []);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeToxicity(message);
      setResult(data);
    } catch (err) {
      setError("Toxicity analysis failed. Connection interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-card">
      <div className="module-header">
        <div className="module-badge mono">MODULE_ID: {moduleId}</div>
        <h2>🛡️ Toxicity Shield</h2>
        <p className="subtitle mono">
          NON_FINANCIAL_THREAT_ANALYSIS :: CYBERBULLYING + HATE_SPEECH + HARASSMENT
        </p>
      </div>

      <div className="module-body">
        {/* ── Input Panel ── */}
        <div className="input-panel">
          <label className="field-label mono">TEXT_SAMPLE_INPUT</label>
          <textarea
            id="toxicity-input"
            className="text-input"
            rows={5}
            placeholder="Paste a message, tweet, or comment to analyze for toxicity..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="input-meta mono">
            <span>CHAR_COUNT: {message.length}</span>
          </div>

          <button
            id="toxicity-analyze-btn"
            className="scan-btn mono"
            onClick={handleAnalyze}
            disabled={loading || !message.trim()}
          >
            {loading ? "ANALYZING..." : "⚡ INITIATE_TOXICITY_SCAN"}
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && <Loader text="SCANNING_FOR_TOXIC_PATTERNS..." />}

        {/* ── Error ── */}
        {error && <div className="error-box mono">{error}</div>}

        {/* ── Results ── */}
        {result && (
          <div className="result-section">
            <ResultPanel data={result} />
            <ConfidenceBar confidence={result.confidence} />

            {/* ── Toxicity Category Badge ── */}
            {result.toxicity_category && (
              <div className="category-badge" style={{
                borderLeft: `3px solid ${result.toxicity_category_color || "#FF7A00"}`,
                padding: "12px 16px",
                marginTop: "12px",
                background: "rgba(255, 122, 0, 0.05)"
              }}>
                <div className="mono" style={{ fontSize: "9px", color: "var(--muted)", letterSpacing: "2px" }}>
                  THREAT_CATEGORY
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: result.toxicity_category_color || "#FF7A00",
                  marginTop: "4px"
                }}>
                  {result.toxicity_category}
                </div>
                <div className="mono" style={{
                  fontSize: "10px",
                  marginTop: "4px",
                  color: result.severity === "HIGH" ? "var(--red)" : "var(--amber)"
                }}>
                  SEVERITY: {result.severity}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Placeholder ── */}
        {!loading && !result && !error && (
          <div className="radar-placeholder" style={{
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
            fontStyle: "italic",
            fontSize: "12px",
            margin: "30px auto",
            textAlign: "center"
          }}>
            AWAITING_INPUT :: Paste text from social media, comments, or messages to scan for toxic patterns...
          </div>
        )}
      </div>
    </div>
  );
}
