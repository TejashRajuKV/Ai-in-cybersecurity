import { useState } from "react";
import "../styles/guardian.css";

// ── Real Indian data breaches (verified historical incidents) ─────────────
const INDIAN_BREACHES = [
  { name: "Air India",        year: 2021, records: "4.5M",  type: "Passport, Credit Card, DoB",     severity: "CRITICAL" },
  { name: "Dominos India",    year: 2021, records: "180M",  type: "Phone, Email, Location, Orders",  severity: "CRITICAL" },
  { name: "MobiKwik",         year: 2021, records: "8.2M",  type: "Phone, Email, Aadhaar hash",      severity: "CRITICAL" },
  { name: "Juspay",           year: 2020, records: "35M",   type: "Masked Card, Email, Phone",        severity: "HIGH"     },
  { name: "BigBasket",        year: 2020, records: "20M",   type: "Email, Phone, Address, Hash",      severity: "HIGH"     },
  { name: "UIDAI (Aadhaar)",  year: 2019, records: "1.1B",  type: "Aadhaar Number, Bank Link",        severity: "CRITICAL" },
  { name: "Matrimony.com",    year: 2019, records: "1.5M",  type: "Name, Phone, Email, Income",       severity: "MEDIUM"   },
  { name: "Truecaller (IN)",  year: 2019, records: "47.5M", type: "Name, Phone, Carrier",             severity: "HIGH"     },
];

// Simple hash to simulate "found in breach" deterministically for demo
function fakeBreachLookup(email) {
  const hash = email.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = (hash % 4) + 1; // 1–4 breaches
  // Shuffle predictably based on email hash
  const shuffled = [...INDIAN_BREACHES].sort((a, b) =>
    ((a.name.charCodeAt(0) + hash) % 7) - ((b.name.charCodeAt(0) + hash) % 7)
  );
  return shuffled.slice(0, count);
}

const SEVERITY_COLOR = {
  CRITICAL: "var(--red)",
  HIGH:     "var(--amber)",
  MEDIUM:   "var(--cyan)",
};

export default function DarkWebPulse() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");

  const handleScan = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("INVALID_EMAIL — enter a valid address");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const hibpKey = import.meta.env.VITE_HIBP_KEY;

    try {
      if (hibpKey) {
        // Real HIBP API call
        const res = await fetch(
          `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
          {
            headers: {
              "hibp-api-key":  hibpKey,
              "user-agent":    "CyberRakshak-ForensicUI",
            },
          }
        );

        if (res.status === 404) {
          setResult({ breaches: [], email, mode: "live" });
        } else if (res.ok) {
          const data = await res.json();
          setResult({
            email, mode: "live",
            breaches: data.map(b => ({
              name:     b.Name,
              year:     new Date(b.BreachDate).getFullYear(),
              records:  `${(b.PwnCount / 1000000).toFixed(1)}M`,
              type:     b.DataClasses.slice(0, 3).join(", "),
              severity: b.PwnCount > 5_000_000 ? "CRITICAL" : b.PwnCount > 1_000_000 ? "HIGH" : "MEDIUM",
            })),
          });
        } else {
          throw new Error(`HIBP API error: ${res.status}`);
        }
      } else {
        // Demo mode — simulate with Indian breach data
        await new Promise(r => setTimeout(r, 1200)); // realistic delay
        const breaches = fakeBreachLookup(email);
        setResult({ email, mode: "demo", breaches });
      }
    } catch (err) {
      setError(`SCAN_ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const found = result?.breaches?.length > 0;

  return (
    <div className="dwp-wrap">
      {/* Header */}
      <div className="dwp-header">
        <div className="dwp-title mono">
          <span className="dwp-icon">⬛</span> DARK_WEB_PULSE
        </div>
        <div className="dwp-desc mono">
          Scan email against known Indian data breach databases
        </div>
      </div>

      {/* Input */}
      <div className="dwp-input-row">
        <input
          className="forensic-input mono"
          placeholder="// ENTER_EMAIL_FOR_BREACH_SCAN"
          value={email}
          type="email"
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleScan()}
        />
        <button
          className="dwp-scan-btn mono"
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? "SCANNING..." : "[ SCAN ]"}
        </button>
      </div>

      {error && <div className="dwp-error mono">{error}</div>}

      {/* Results */}
      {result && (
        <div className="dwp-result fade-up">
          {/* Verdict stamp */}
          <div className={`dwp-verdict ${found ? "breach-found" : "clean"}`}>
            {found
              ? `⚠ EXPOSURE DETECTED — ${result.breaches.length} BREACH${result.breaches.length > 1 ? "ES" : ""}`
              : "✓ NO EXPOSURE DETECTED"
            }
            {result.mode === "demo" && (
              <span className="dwp-demo-tag"> [DEMO]</span>
            )}
          </div>

          {found && (
            <>
              <div className="dwp-risk-note mono">
                ⚡ Your data was exposed in{" "}
                {result.breaches.filter(b => b.severity === "CRITICAL").length} critical breach(es).
                This significantly elevates your scam target profile.
              </div>

              {/* Breach table */}
              <div className="dwp-breach-list">
                {result.breaches.map((b, i) => (
                  <div key={i} className="dwp-breach-row">
                    <div className="dwp-breach-left">
                      <div className="dwp-breach-name mono">{b.name}</div>
                      <div className="dwp-breach-type mono">{b.type}</div>
                    </div>
                    <div className="dwp-breach-right">
                      <div className="dwp-breach-year mono">{b.year}</div>
                      <div className="dwp-breach-records mono">{b.records} records</div>
                      <div
                        className="dwp-severity mono"
                        style={{ color: SEVERITY_COLOR[b.severity] }}
                      >
                        {b.severity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dwp-advice mono">
                RECOMMENDATION: Change passwords immediately. Enable 2FA on all accounts.
                Avoid sharing OTPs or personal data via calls/messages.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
