import { useEffect, useState } from "react";
import { checkHealth } from "../api/api";
import "../styles/dashboard.css";

export default function Navbar() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        CYBER<span>RAKSHAK</span>
      </div>
      <div className="navbar-status">
        <div
          className="status-dot"
          style={{ background: online ? "var(--green)" : "var(--red)" }}
        />
        {online ? "BACKEND ONLINE" : "BACKEND OFFLINE"}
      </div>
    </nav>
  );
}


