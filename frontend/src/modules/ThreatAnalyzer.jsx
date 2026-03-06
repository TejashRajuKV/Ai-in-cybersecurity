import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import "../styles/modules.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ThreatAnalyzer() {
  const [message,  setMessage]  = useState("");
  const [url,      setUrl]      = useState("");
  const [app,      setApp]      = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleAnalyze = async () => {
    if (!message.trim() && !url.trim() && !app.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/threat`, {
        message, url, app
      });
      setResult(response.data);
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage(""); setUrl(""); setApp("");
    setResult(null); setError(null);
  };

  // ── Color helpers ──
  const getColor = (c) => ({
    red: "var(--red)", yellow: "var(--yellow)", green: "var(--green)"
  }[c] || "var(--muted)");

  const getBg = (c) => ({
    red:    "rgba(255,45,85,0.1)",
    yellow: "rgba(255,208,0,0.1)",
    green:  "rgba(0,255,157,0.1)"
  }[c] || "transparent");

  const getBorder = (c) => ({
    red:    "rgba(255,45,85,0.3)",
    yellow: "rgba(255,208,0,0.3)",
    green:  "rgba(0,255,157,0.3)"
  }[c] || "var(--border)");

  return (
    <div>
      <div className="module-title">🔎 Threat Analyzer</div>
      <div className="module-desc">
        // Paste message, URL, or app name — we scan everything at once
      </div>

      {/* ── Inputs ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Message */}
        <div>
          <label className="mono muted" style={{ display: "block", marginBottom: "6px" }}>
            // SUSPICIOUS MESSAGE
          </label>
          <textarea
            className="input"
            rows={4}
            placeholder="Paste suspicious message here...
Example: Your KYC will be suspended. Send OTP immediately."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* URL */}
        <div>
          <label className="mono muted" style={{ display: "block", marginBottom: "6px" }}>
            // SUSPICIOUS URL (optional)
          </label>
          <input
            className="input"
            type="text"
            placeholder="https://suspicious-link.xyz/verify"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* App Name */}
        <div>
          <label className="mono muted" style={{ display: "block", marginBottom: "6px" }}>
            // LOAN APP NAME (optional)
          </label>
          <input
            className="input"
            type="text"
            placeholder="e.g. InstantCash, QuickLoan"
            value={app}
            onChange={(e) => setApp(e.target.value)}
          />
        </div>

      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || (!message.trim() && !url.trim() && !app.trim())}
          style={{ flex: 1 }}
        >
          {loading ? "Scanning..." : "🔎 Analyze Threats"}
        </button>
        <button className="btn btn-outline" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && <Loader text="SCANNING ALL THREATS..." />}

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginTop: "16px", padding: "16px",
          background: "rgba(255,45,85,0.1)",
          border: "1px solid rgba(255,45,85,0.3)",
          borderRadius: "6px", color: "var(--red)", fontSize: "13px"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div style={{ marginTop: "24px" }} className="fade-up">

          {/* ── Overall Risk ── */}
          <div style={{
            padding:      "20px 24px",
            background:   getBg(result.overall_color),
            border:       `1px solid ${getBorder(result.overall_color)}`,
            borderRadius: "8px",
            marginBottom: "16px",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "space-between",
            flexWrap:     "wrap",
            gap:          "12px"
          }}>
            <div>
              <div style={{
                fontFamily:    "var(--font-mono)",
                fontSize:      "10px",
                letterSpacing: "3px",
                color:         "var(--muted)",
                marginBottom:  "6px"
              }}>
                // OVERALL THREAT LEVEL
              </div>
              <div style={{
                fontSize:   "24px",
                fontWeight: "800",
                color:      getColor(result.overall_color)
              }}>
                {result.overall_emoji} {result.overall_label}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize:   "40px",
                fontWeight: "800",
                color:      getColor(result.overall_color)
              }}>
                {result.overall_confidence}%
              </div>
              <div className="mono muted" style={{ fontSize: "10px" }}>
                {result.threat_count} THREAT{result.threat_count !== 1 ? "S" : ""} DETECTED
              </div>
            </div>
          </div>

          {/* ── Safe Message ── */}
          {result.safe && (
            <div style={{
              padding:      "20px",
              background:   "rgba(0,255,157,0.05)",
              border:       "1px solid rgba(0,255,157,0.2)",
              borderRadius: "8px",
              textAlign:    "center",
              color:        "var(--green)"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
              <div style={{ fontWeight: "700", fontSize: "16px" }}>
                No threats detected
              </div>
              <div className="mono muted" style={{ fontSize: "11px", marginTop: "4px" }}>
                Input appears safe
              </div>
            </div>
          )}

          {/* ── Individual Threats ── */}
          {result.threats.length > 0 && (
            <div>
              <div className="mono muted" style={{
                fontSize: "9px", letterSpacing: "4px", marginBottom: "12px"
              }}>
                // DETECTED THREATS
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {result.threats.map((threat, i) => (
                  <div key={i} style={{
                    padding:      "16px 20px",
                    background:   getBg(threat.color),
                    border:       `1px solid ${getBorder(threat.color)}`,
                    borderRadius: "6px",
                  }}>

                    {/* Threat Header */}
                    <div style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "center",
                      marginBottom:   "10px"
                    }}>
                      <div style={{
                        display:    "flex",
                        alignItems: "center",
                        gap:        "8px",
                        fontWeight: "700",
                        color:      getColor(threat.color),
                        fontSize:   "14px"
                      }}>
                        <span>{threat.icon}</span>
                        <span>{threat.type}</span>
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: "700",
                        fontSize:   "14px",
                        color:      getColor(threat.color)
                      }}>
                        {threat.confidence}%
                      </div>
                    </div>

                    {/* Reason — Explainable AI */}
                    <div style={{ marginBottom: "10px" }}>
                      <div className="mono muted" style={{
                        fontSize: "9px", letterSpacing: "3px", marginBottom: "6px"
                      }}>
                        // WHY IS THIS RISKY?
                      </div>
                      {threat.reason.split(" + ").map((r, j) => (
                        <div key={j} style={{
                          display:      "flex",
                          alignItems:   "center",
                          gap:          "8px",
                          padding:      "5px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          fontSize:     "13px",
                          color:        "var(--text)"
                        }}>
                          <span style={{ color: getColor(threat.color) }}>▶</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>

                    {/* Flagged Keywords */}
                    {threat.keywords && threat.keywords.length > 0 && (
                      <div>
                        <div className="mono muted" style={{
                          fontSize: "9px", letterSpacing: "3px", marginBottom: "6px"
                        }}>
                          // FLAGGED KEYWORDS
                        </div>
                        <div className="flagged-words">
                          {threat.keywords.map((kw, k) => (
                            <span key={k} className="flagged-word">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}