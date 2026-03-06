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
        {/* ── Cyberpunk Procedural Core ── */}
        <div className="core-rings">
          <div className="ring ring-1" style={{ borderColor: 'var(--cyan)', transform: `rotate(${rotation}deg)` }}></div>
          <div className="ring ring-2" style={{ borderColor: 'var(--pink)', transform: `rotate(${-rotation * 1.5}deg)` }}></div>
          <div className="ring ring-3" style={{ borderColor: 'var(--yellow)', transform: `rotate(${rotation * 0.5}deg)` }}></div>
        </div>
        
        <svg className="core-svg" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="coreGradient">
              <stop offset="0%" stopColor="var(--pink)" stopOpacity="0.9" />
              <stop offset="60%" stopColor="var(--cyan)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="40" fill="url(#coreGradient)">
            <animate attributeName="r" values="36;44;36" dur="2s" repeatCount="indefinite" />
          </circle>
          <path 
            d="M100 0 L100 200 M0 100 L200 100" 
            stroke="var(--pink)" 
            strokeWidth="0.2" 
            opacity="0.4" 
          />
          <circle cx="100" cy="100" r="70" stroke="var(--cyan)" strokeWidth="0.5" fill="none" strokeDasharray="10,5" />
        </svg>

        <div className="scan-line-horizontal" style={{ background: 'linear-gradient(90deg, transparent, var(--pink), transparent)' }}></div>
      </div>
      
      <div className="hero-overlay">
        <h1 className="hero-title flicker" data-text="CYBERRAKSHAK">CYBER<span>RAKSHAK</span></h1>
        <p className="hero-tagline mono">SYSTEM_PROTOCOL_INITIATED // FORENSIC_OVERRIDE</p>
        <div className="scroll-indicator">
          <div className="mouse" style={{ borderColor: 'var(--pink)' }}></div>
          <span style={{ color: 'var(--pink)' }}>INITIALIZE SCAN SEQUENCE</span>
        </div>
      </div>
    </div>
  );
}
