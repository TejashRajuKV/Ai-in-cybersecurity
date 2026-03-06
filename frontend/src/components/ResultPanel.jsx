import { useEffect, useRef } from "react";
import { animateResultCard } from "../animations/riskAnimation";
import { getRiskColor } from "../utils/riskHelpers";
import "../styles/modules.css";

export default function ResultPanel({ result }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      animateResultCard(panelRef.current);
    }
  }, [result]);

  if (!result) return null;

  const {
    label,
    confidence,
    risk_color,
    reason,
    flagged_words = [],
    explanation   = {}
  } = result;

  const isAnomalous = label === "ANOMALY" || label === "HIGH RISK";

  return (
    <div ref={panelRef} className="result-dossier fade-up">
      {/* ── Verdict Stamp ── */}
      <div className="verdict-stamp-wrap">
        <div className={`verdict-stamp ${isAnomalous ? 'stamp-anomaly' : 'stamp-clear'}`}>
          {isAnomalous ? "DETECTED" : "CLEARED"}
        </div>
      </div>

      <div className="dossier-line">
        <div className="dossier-label">CASE_VERDICT</div>
        <div className="dossier-value" style={{ color: getRiskColor(risk_color), fontWeight: 900 }}>
          {label.toUpperCase()}
        </div>
      </div>

      <div className="dossier-line">
        <div className="dossier-label">CONFIDENCE_LVR</div>
        <div className="dossier-value mono">{(confidence * 100).toFixed(2)}%</div>
      </div>

      <div className="dossier-line">
        <div className="dossier-label">PRIMARY_INDICATORS</div>
        <div className="dossier-value">
          {reason.split(" + ").map((r, i) => (
            <div key={i} className="mono" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <span className="text-cyan">»</span> {r}
            </div>
          ))}
        </div>
      </div>

      {flagged_words.length > 0 && (
        <div className="dossier-line">
          <div className="dossier-label">FLAGGED_SIGNATURES</div>
          <div className="dossier-value">
            <div className="flagged-words">
              {flagged_words.map((word, i) => (
                <span key={i} className="flagged-word">{word}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {explanation.template && (
        <div className="dossier-line">
          <div className="dossier-label">NEURAL_DEBRIEF</div>
          <div className="dossier-value italic" style={{ fontSize: '13px', opacity: 0.8 }}>
            {explanation.template}
          </div>
        </div>
      )}

      {explanation.tip && (
        <div className="safety-tip">
          <span className="safety-tip-label">// RESOLUTION_PROTOCOL</span>
          {explanation.tip}
        </div>
      )}
    </div>
  );
}
