import { useEffect, useRef, useState } from "react";
import "../styles/Forensic3DScene.css";

export default function Forensic3DScene() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = window.innerHeight * 1.2;
      setScrollProgress(Math.min(1, scrollTop / maxScroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rotation = scrollProgress * 360;
  const scale = 1 + scrollProgress * 0.5;
  const opacity = 1 - scrollProgress * 1.5;

  return (
    <div className="three-d-container" style={{ opacity: Math.max(0, opacity) }}>
      <div className="forensic-core-wrapper" style={{ transform: `scale(${scale})` }}>
        {/* ── Procedural Forensic Core ── */}
        <div className="core-rings">
          <div className="ring ring-1" style={{ transform: `rotate(${rotation}deg)` }}></div>
          <div className="ring ring-2" style={{ transform: `rotate(${-rotation * 1.5}deg)` }}></div>
          <div className="ring ring-3" style={{ transform: `rotate(${rotation * 0.5}deg)` }}></div>
        </div>
        
        <svg className="core-svg" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="coreGradient">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="40" fill="url(#coreGradient)">
            <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite" />
          </circle>
          <path 
            d="M100 20 L100 180 M20 100 L180 100" 
            stroke="var(--cyan)" 
            strokeWidth="0.5" 
            opacity="0.3" 
          />
          <circle cx="100" cy="100" r="80" stroke="var(--cyan)" strokeWidth="0.2" fill="none" strokeDasharray="5,5" />
        </svg>

        <div className="scan-line-horizontal"></div>
      </div>
      
      <div className="hero-overlay">
        <h1 className="hero-title">CYBER<span>RAKSHAK</span></h1>
        <p className="hero-tagline mono">AI-POWERED FORENSIC INTELLIGENCE ENGINE</p>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>SCROLL TO INITIALIZE SCAN</span>
        </div>
      </div>
    </div>
  );
}
