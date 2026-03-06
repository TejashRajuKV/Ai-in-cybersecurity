import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkHealth } from "../api/api";
import "../styles/global.css";

export default function Navbar({ theme, toggleTheme }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    // Initial check
    checkHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
    
    // Poll every 30s
    const interval = setInterval(() => {
        checkHealth()
          .then(() => setOnline(true))
          .catch(() => setOnline(false));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar technical-status-bar">
      <div className="container nav-container-simplified">
        {/* ── Brand ── */}
        <Link to="/" className="navbar-brand mono">
          [ CYBERRAKSHAK_V1.1 ]
        </Link>

        {/* ── Simplified Status Controls ── */}
        <div className="navbar-controls-group mono">
          
          {/* ── Theme Toggle ── */}
          <div className="theme-toggle-container" onClick={toggleTheme}>
            <div className={`theme-switch-forensic ${theme}`}>
                <div className="switch-dial">
                    {theme === 'dark' ? '☾' : '☼'}
                </div>
            </div>
            <span className="label" style={{ marginLeft: '12px' }}>// MODE: {theme.toUpperCase()}</span>
          </div>

          <div className="status-divider">|</div>

          {/* ── Backend Status ── */}
          <div className="backend-status-wrap">
            <span className="label">BACKEND:</span>
            <span className={`status-text ${online ? 'text-green' : 'text-red'}`}>
              {online ? "CONNECTED" : "OFFLINE"}
            </span>
            <div className={`status-dot ${online ? 'online' : 'offline'}`}></div>
          </div>

        </div>
      </div>
    </nav>
  );
}
