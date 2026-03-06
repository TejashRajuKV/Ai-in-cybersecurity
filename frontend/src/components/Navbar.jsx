import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { checkHealth } from "../api/api";
import "../styles/global.css";

export default function Navbar({ theme, toggleTheme }) {
  const [online, setOnline] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  const handleNavClick = (anchor) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar technical-status-bar">
      <div className="container nav-container">
        <Link to="/" className="navbar-brand mono">
          [ PROJECT_RAKSHAK ]
        </Link>

        <div className="nav-links mono">
          <button className="nav-btn" onClick={() => handleNavClick('modules')}>// FILES</button>
          <button className="nav-btn" onClick={() => handleNavClick('engine')}>// INTEL</button>
          <Link to="/dashboard" className="nav-btn">DASHBOARD_LIVE</Link>
          <a href="https://github.com/TejashRajuKV/Ai-in-cybersecurity" target="_blank" className="nav-btn">// DOCS</a>
        </div>

        <div className="navbar-status-indicator mono">
          {/* ── Theme Toggle ── */}
          <div className="theme-toggle-wrap" onClick={toggleTheme} style={{ cursor: 'pointer', marginRight: '20px' }}>
            <span className="label">THEME_MODE:</span>
            <span className="status-text text-cyan" style={{ marginLeft: '4px' }}>
              [{theme.toUpperCase()}]
            </span>
          </div>

          <span className="label">BACKEND:</span>
          <span className={`status-text ${online ? 'text-green' : 'text-red'}`}>
            {online ? "CONNECTED" : "OFFLINE"}
          </span>
          <div className={`status-dot ${online ? 'online' : 'offline'}`}></div>
        </div>
      </div>
    </nav>
  );
}
