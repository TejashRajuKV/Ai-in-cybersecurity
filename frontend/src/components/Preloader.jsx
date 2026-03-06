import { useState, useEffect } from "react";
import "../styles/Preloader.css";

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const handleLoading = () => {
      setPercent((prev) => {
        if (prev >= 100) return 100;
        
        // Staccato loading logic: sometimes small jumps, sometimes large
        const randomPower = Math.random();
        let increment = 1;
        
        if (randomPower > 0.9) increment = 8;
        else if (randomPower > 0.7) increment = 3;
        else if (randomPower < 0.1) increment = 0; // Pause briefly
        
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    };

    const interval = setInterval(handleLoading, 60);

    if (percent === 100) {
      clearInterval(interval);
      const timeout = setTimeout(onComplete, 1200); // 1.2s delay for a smooth fade
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [onComplete, percent]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="preloader-overlay">
      <div className="preloader-container">
        
        {/* ── Multi-Layered Forensic Scanner ── */}
        <div className="progress-wrapper">
          
          {/* Decorative Outer Rings */}
          <div className="outer-ring ring-slow"></div>
          <div className="outer-ring ring-fast"></div>

          <svg className="progress-svg" width="240" height="240" viewBox="0 0 240 240">
            {/* Inner Glow Center */}
            <circle cx="120" cy="120" r="60" fill="url(#innerGlow)" opacity="0.1" />
            
            <circle
              className="progress-bg"
              cx="120"
              cy="120"
              r={radius}
            />
            <circle
              className="progress-bar"
              cx="120"
              cy="120"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />

            <defs>
              <radialGradient id="innerGlow">
                <stop offset="0%" stopColor="var(--cyan)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
          
          <div className="percent-display">
            <div className="glitch-wrapper">
              <span className="percent-num" data-text={`${Math.min(100, percent)}%`}>
                {Math.min(100, percent)}%
              </span>
            </div>
            <div className="status-label mono">
              <span className="blink">▶</span> {percent < 100 ? "INITIALIZING_FORENSIC_CORE" : "CORE_READY"}
            </div>
          </div>

          <div className="scan-needle" style={{ transform: `rotate(${(percent/100) * 360}deg)` }}></div>
        </div>

        {/* ── Bottom Data Ticker ── */}
        <div className="ticker-container mono">
          <div className="ticker-item">ACCESS_LEVEL: 0</div>
          <div className="ticker-item">PROTOCOL: CYBER_RAKSHAK_V2.0</div>
          <div className="ticker-item">ENCRYPTION: AES_256_ACTIVE</div>
        </div>

      </div>
    </div>
  );
}
