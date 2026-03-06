import { useState, useEffect } from "react";
import { analyzeNews } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import TruthGauge from "../components/TruthGauge";
import "../styles/modules.css";

export default function FakeNewsChecker() {
  const [text,    setText]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    setModuleId(`UNIT-${Math.floor(Math.random() * 900 + 100)}-FN`);
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeNews(text);
      setResult(data);
    } catch (err) {
      setError("Source authentication failed. Data stream corrupted.");
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    "Government gives free Rs 10000 to all Aadhaar card holders.",
    "RBI raises repo rate by 25 basis points to control inflation in India.",
    "WhatsApp will shut down next week unless you forward this message.",
  ];

  return (
    <div className="forensic-module">
      {/* ── Technical Header ── */}
      <div className="module-header-technical">
        <div className="module-id-label mono">// {moduleId} // LINGUISTIC.PROBE</div>
        <h2 className="module-technical-title">FAKE NEWS <span className="text-cyan">CHECKER</span></h2>
        <div className="module-desc mono">STANCE_DETECTION_ENGINE_V1_ACTIVE</div>
      </div>

      {/* ── Demo Controls ── */}
      <div className="demo-controls">
        {samples.map((s, i) => (
          <button key={i} className="btn-demo" onClick={() => setText(s)}>LOAD_SAMPLE_0{i+1}</button>
        ))}
      </div>

      {/* ── Technical Input ── */}
      <div className="forensic-input-group">
        <span className="forensic-label mono">// DATA_STREAM_INPUT</span>
        <div className="input-bracket-wrap">
          <textarea
            className="forensic-input"
            rows={5}
            placeholder="PASTE NEWS HEADLINE OR MESSAGE FOR SOURCE AUTHENTICATION..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          className="btn-forensic-scan"
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          style={{ flex: 1 }}
        >
          {loading ? "AUTHENTICATING_SOURCES..." : "[ INITIATE_SOURCE_VERIFICATION ]"}
        </button>
        <button
          className="btn-demo"
          style={{ padding: "0 24px" }}
          onClick={() => { setText(""); setResult(null); }}
        >
          RESET
        </button>
      </div>

      {/* ── Visualizations ── */}
      {(loading || result) && (
        <TruthGauge 
          confidence={result?.confidence || 50} 
          loading={loading} 
        />
      )}

      {loading && <Loader text="CROSS_REFERENCING_GLOBAL_INTEL..." />}

      {error && <div className="error-box mono">!! CRITICAL_ERROR: {error}</div>}

      {result && !loading && (
        <ResultPanel result={result} />
      )}
    </div>
  );
}
