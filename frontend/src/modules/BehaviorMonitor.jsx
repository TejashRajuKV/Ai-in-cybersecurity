import { useState, useEffect } from "react";
import { analyzeBehavior } from "../api/api";
import ResultPanel from "../components/ResultPanel";
import Loader from "../components/Loader";
import NeuralRadar from "../components/NeuralRadar";
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
  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    setModuleId(`UNIT-${Math.floor(Math.random() * 900 + 100)}-BM`);
  }, []);

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
      setError("Forensic probe failed. Connection interrupted.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "hour",          label: "LOGIN_HOUR",    min: 0,  max: 23,     step: 1    },
    { key: "amount",        label: "TRANS_AMOUNT",  min: 0,  max: 999999, step: 100  },
    { key: "transactions",  label: "DAILY_COUNT",   min: 0,  max: 100,    step: 1    },
    { key: "new_device",    label: "HW_SIGNATURE",  min: 0,  max: 1,      step: 1    },
    { key: "failed_logins", label: "AUTH_FAILURES", min: 0,  max: 20,     step: 1    },
  ];

  return (
    <div className="forensic-module">
      {/* ── Technical Header ── */}
      <div className="module-header-technical">
        <div className="module-id-label mono">// {moduleId} // SYSTEM.PROBE</div>
        <h2 className="module-technical-title">BEHAVIOR <span className="text-cyan">MONITOR</span></h2>
        <div className="module-desc mono">ANOMALY_DETECTION_ENGINE_V2_ACTIVE</div>
      </div>

      {/* ── Demo Controls ── */}
      <div className="demo-controls">
        <button className="btn-demo" onClick={() => setFormData(defaultData)}>LOAD_BASELINE</button>
        <button className="btn-demo" onClick={() => setFormData(anomalyData)}>LOAD_ANOMALY_VECTOR</button>
      </div>

      {/* ── Technical Inputs ── */}
      <div className="behavior-grid">
        {fields.map((field) => (
          <div key={field.key} className="forensic-input-group">
            <span className="forensic-label mono">{field.label}</span>
            <div className="input-bracket-wrap">
              <input
                type="number"
                className="forensic-input"
                min={field.min}
                max={field.max}
                step={field.step}
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Forensic Scan Button ── */}
      <button
        className="btn-forensic-scan"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "SCANNING_PACKETS..." : "[ START_BEHAVIOR_ANALYSIS ]"}
      </button>

      {/* ── Visualizations ── */}
      {(loading || result) && (
        <NeuralRadar 
          loading={loading} 
          flaggedFields={result?.flagged_words || []} 
          isAnomalous={result?.label === "ANOMALY"}
        />
      )}

      {loading && <Loader text="CORRELATING_DATA_POINTS..." />}

      {error && <div className="error-box mono">!! CRITICAL_ERROR: {error}</div>}

      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
