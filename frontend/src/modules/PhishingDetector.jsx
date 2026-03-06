import { useState } from "react";
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

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzePhishing(url);
      setResult(data);
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    "http://secure-login-bank-india.com/update",
    "https://www.google.com",
    "http://192.168.1.1/login.php",
  ];

  return (
    <div>
      <div className="module-title">🎣 Phishing Detector</div>
      <div className="module-desc">
        // Analyze suspicious links for typosquatting, hidden IPs, and malicious patterns
      </div>

      {/* ── Samples ── */}
      <div style={{ marginBottom: "12px" }}>
        <span className="mono muted" style={{ display: "block", marginBottom: "8px" }}>
          // Test with sample URLs:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {samples.map((s, i) => (
            <button
              key={i}
              className="btn btn-outline"
              style={{ fontSize: "11px", padding: "6px 12px" }}
              onClick={() => setURL(s)}
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ── */}
      <div className="input-wrap">
        <input
          type="text"
          className="input"
          placeholder="Paste URL here (e.g., http://login-verify.me)"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          style={{ flex: 1 }}
        >
          {loading ? "Tracing..." : "🎣 Analyze Link"}
        </button>
        <button
          className="btn btn-outline"
          onClick={() => { setURL(""); setResult(null); }}
        >
          Clear
        </button>
      </div>

      {/* ── URL Trace Visualization ── */}
      {(loading || result) && (
        <URLTrace 
          loading={loading} 
          url={url} 
          isPhishing={result?.label === "HIGH RISK"} 
        />
      )}

      {/* ── Loading ── */}
      {loading && <Loader text="DECONSTRUCTING URL..." />}

      {/* ── Error ── */}
      {error && (
        <div className="error-box">
          ⚠️ {error}
        </div>
      )}

      {/* ── Result ── */}
      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
