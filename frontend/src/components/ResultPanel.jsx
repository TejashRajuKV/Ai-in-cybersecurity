import { useEffect, useRef } from "react";
import { animateResultCard } from "../animations/riskAnimation";
import RiskBadge      from "./RiskBadge";
import ConfidenceBar  from "./ConfidenceBar";
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

  return (
    <div ref={panelRef} className="result-panel fade-up">

      {/* ── Risk Badge ── */}
      <div style={{ marginBottom: "16px" }}>
        <RiskBadge
          label={label}
          color={risk_color}
          confidence={confidence}
        />
      </div>

      {/* ── Confidence Bar ── */}
      <ConfidenceBar
        confidence={confidence}
        color={risk_color}
      />

      {/* ── Reason ── */}
      <div className="result-section" style={{ marginTop: "20px" }}>
        <span className="result-label">// DETECTION REASON</span>
        <p className="result-reason">{reason}</p>
      </div>

      {/* ── Flagged Words ── */}
      {flagged_words.length > 0 && (
        <div className="result-section">
          <span className="result-label">// FLAGGED KEYWORDS</span>
          <div className="flagged-words">
            {flagged_words.map((word, i) => (
              <span key={i} className="flagged-word">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Explanation ── */}
      {explanation.template && (
        <div className="result-section">
          <span className="result-label">// AI ANALYSIS</span>
          <p className="result-reason">{explanation.template}</p>
        </div>
      )}

      {/* ── Safety Tip ── */}
      {explanation.tip && (
        <div className="safety-tip">
          <span className="safety-tip-label">// SAFETY TIP</span>
          {explanation.tip}
        </div>
      )}

    </div>
  );
}