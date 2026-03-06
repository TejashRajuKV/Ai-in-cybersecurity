import { useEffect, useRef } from "react";
import { animateGaugeNeedle } from "../animations/newsAnimations";
import "../styles/modules.css";

export default function TruthGauge({ confidence, loading }) {
  const needleRef = useRef(null);

  useEffect(() => {
    if (!loading && needleRef.current) {
        // Invert: High confidence (Risk) = Left (Fake/Red)
        // 0 Risk -> 90deg (Right), 100 Risk -> -90deg (Left)
        const rotation = 90 - (confidence * 1.8);
        animateGaugeNeedle(needleRef.current, rotation);
    }
  }, [confidence, loading]);

  return (
    <div className="gauge-wrap">
      <div className="gauge-svg-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          {/* Background Arc */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke="var(--surface)" 
            strokeWidth="10" 
            strokeLinecap="round" 
          />
          {/* Spectrum Arc */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke="url(#gauge-gradient)" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeDasharray="251"
            strokeDashoffset="0"
          />
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#FF2D55" />
              <stop offset="50%"  stopColor="#FFD60A" />
              <stop offset="100%" stopColor="#00FF9D" />
            </linearGradient>
          </defs>

          {/* Scale Markers */}
          <text x="15"  y="115" className="gauge-marker">FAKE</text>
          <text x="165" y="115" className="gauge-marker">TRUE</text>

          {/* Needle */}
          <g ref={needleRef} className="needle-group" style={{ transform: "rotate(90deg)" }}>
            <line 
                x1="100" y1="100" x2="100" y2="40" 
                stroke="var(--white)" 
                strokeWidth="3" 
                strokeLinecap="round" 
            />
            <circle cx="100" cy="100" r="5" fill="var(--white)" />
          </g>
        </svg>
      </div>
      <div className="gauge-label">
        TRUTH PROBABILITY: <span className="mono">{loading ? "CALCULATING..." : `${100 - confidence}%`}</span>
      </div>
    </div>
  );
}
