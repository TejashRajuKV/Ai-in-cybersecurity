import { useState, useEffect } from "react";
import { analyzePhishing } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import URLTrace from "../components/URLTrace";
import "../styles/modules.css";

export default function PhishingDetector() {
  const [url,     setURL]     = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    setModuleId(`UNIT-${Math.floor(Math.random() * 900 + 100)}-PD`);
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzePhishing(url);
      setResult(data);
    } catch (err) {
      setError("Trace failed. Domain resolution timeout.");
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    "http://secure-login-bank-india.com/update",
    "http://192.168.1.1/login.php",
    "https://www.google.com",
  ];

  return (
    <div className="forensic-module">
      {/* ── Technical Header ── */}
      <div className="module-header-technical">
        <div className="module-id-label mono">// {moduleId} // NETWORK.TRACE</div>
        <h2 className="module-technical-title">PHISHING <span className="text-cyan">SCANNER</span></h2>
        <div className="module-desc mono">URL_HEURISTIC_ENGINE_V2_ACTIVE</div>
      </div>

      {/* ── Demo Controls ── */}
      <div className="demo-controls">
        {samples.map((s, i) => (
          <button key={i} className="btn-demo" onClick={() => setURL(s)}>LOAD_TARGET_0{i+1}</button>
        ))}
      </div>

      {/* ── Technical Input ── */}
      <div className="forensic-input-group">
        <span className="forensic-label mono">// TARGET_URI_STRING</span>
        <div className="input-bracket-wrap">
          <input
            type="text"
            className="forensic-input"
            placeholder="ENTER SUSPICIOUS URL FOR DECONSTRUCTION..."
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
        </div>
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          className="btn-forensic-scan"
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          style={{ flex: 1 }}
        >
          {loading ? "TRACING_HOPS..." : "[ INITIATE_URL_DECONSTRUCTION ]"}
        </button>
        <button
          className="btn-demo"
          style={{ padding: "0 24px" }}
          onClick={() => { setURL(""); setResult(null); }}
        >
          RESET
        </button>
      </div>

      {/* ── Visualizations ── */}
      {(loading || result) && (
        <URLTrace 
          loading={loading} 
          url={url} 
          isPhishing={result?.label === "HIGH RISK"} 
        />
      )}

      {loading && <Loader text="MAPPING_DOMAIN_SIGNATURES..." />}

      {error && <div className="error-box mono">!! CRITICAL_ERROR: {error}</div>}

      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
