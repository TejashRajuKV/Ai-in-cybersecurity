import { useState, useEffect } from "react";
import "../styles/Preloader.css";

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); // Small delay after 100%
          return 100;
        }
        // Random increments for a "scanning" feel
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  // SVG Circle Logic
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="preloader-overlay">
      <div className="preloader-container">
        
        {/* ── Circular Progress ── */}
        <div className="progress-wrapper">
          <svg className="progress-svg" width="220" height="220">
            <circle
              className="progress-bg"
              cx="110"
              cy="110"
              r={radius}
            />
            <circle
              className="progress-bar"
              cx="110"
              cy="110"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          
          <div className="percent-display">
            <span className="percent-num">{Math.min(100, percent)}%</span>
            <span className="status-text mono">ANALYZING_CORE_SYSTEMS</span>
          </div>

          <div className="scan-needle" style={{ transform: `rotate(${(percent/100) * 360}deg)` }}></div>
        </div>

        {/* ── Grid Decoration ── */}
        <div className="preloader-grid"></div>
        
        <div className="loading-bar-flat">
          <div className="loading-fill" style={{ width: `${percent}%` }}></div>
        </div>

      </div>
    </div>
  );
}
