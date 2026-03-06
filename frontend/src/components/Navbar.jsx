import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkHealth } from "../api/api";
import "../styles/global.css";

export default function Navbar() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="navbar-brand mono">
          CYBER<span className="text-cyan">RAKSHAK</span>
        </Link>

        <div className="nav-links mono">
          <Link to="/#modules">MODULES</Link>
          <Link to="/#engine">ENGINE</Link>
          <Link to="/#stack">STACK</Link>
          <Link to="/#docs">DOCS</Link>
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


