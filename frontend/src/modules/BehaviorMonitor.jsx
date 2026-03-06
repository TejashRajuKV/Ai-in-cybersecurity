import { useState } from "react";
import { analyzeBehavior } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import "../styles/modules.css";

const defaultData = {
  hour:          12,
  amount:        500,
  transactions:  3,
  new_device:    0,
  failed_logins: 0,
};

const anomalyData = {
  hour:          2,
  amount:        95000,
  transactions:  25,
  new_device:    1,
  failed_logins: 5,
};

export default function BehaviorMonitor() {
  const [formData, setFormData] = useState(defaultData);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeBehavior(formData);
      setResult(data);
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "hour",          label: "LOGIN HOUR (0-23)",       min: 0,  max: 23,     step: 1    },
    { key: "amount",        label: "TRANSACTION AMOUNT (₹)",  min: 0,  max: 999999, step: 100  },
    { key: "transactions",  label: "TRANSACTIONS TODAY",      min: 0,  max: 100,    step: 1    },
    { key: "new_device",    label: "NEW DEVICE (0=No, 1=Yes)",min: 0,  max: 1,      step: 1    },
    { key: "failed_logins", label: "FAILED LOGINS",           min: 0,  max: 20,     step: 1    },
  ];

  return (
    <div>
      <div className="module-title">📊 Behavior Monitor</div>
      <div className="module-desc">
        // Enter transaction details to detect anomalous behavior
      </div>

      {/* ── Quick Demo Buttons ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          className="btn btn-outline"
          style={{ fontSize: "11px" }}
          onClick={() => setFormData(defaultData)}
        >
          🟢 Load Normal
        </button>
        <button
          className="btn btn-outline"
          style={{ fontSize: "11px" }}
          onClick={() => setFormData(anomalyData)}
        >
          🔴 Load Anomaly
        </button>
      </div>

      {/* ── Form Fields ── */}
      <div className="behavior-grid">
        {fields.map((field) => (
          <div key={field.key} className="behavior-field">
            <label>{field.label}</label>
            <input
              type="number"
              className="input"
              min={field.min}
              max={field.max}
              step={field.step}
              value={formData[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* ── Analyze Button ── */}
      <button
        className="btn btn-primary"
        onClick={handleAnalyze}
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading ? "Analyzing..." : "📊 Analyze Behavior"}
      </button>

      {/* ── Loading ── */}
      {loading && <Loader text="DETECTING ANOMALIES..." />}

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
      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
