import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { checkHealth } from "../api/api";
import "../styles/global.css";

export default function Navbar() {
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
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="navbar-brand mono">
          CYBER<span className="text-cyan">RAKSHAK</span>
        </Link>

        <div className="nav-links mono">
          <button className="nav-btn" onClick={() => handleNavClick('modules')}>MODULES</button>
          <button className="nav-btn" onClick={() => handleNavClick('engine')}>ENGINE</button>
          <Link to="/dashboard">DASHBOARD</Link>
          <a href="https://github.com/TejashRajuKV/Ai-in-cybersecurity" target="_blank" className="nav-btn">DOCS</a>
        </div>

        <div className="navbar-status mono">
          <div
            className="status-dot"
            style={{ 
              background: online ? "var(--green)" : "var(--red)",
              boxShadow: online ? "0 0 10px var(--green)" : "0 0 10px var(--red)"
            }}
          />
          <span style={{ color: online ? "var(--green)" : "var(--red)" }}>
            {online ? "BACKEND ONLINE" : "BACKEND OFFLINE"}
          </span>
        </div>
      </div>
    </nav>
  );
}


