import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">CyberRakshak AI</div>
        <div className="nav-links">
          <button>Dashboard</button>
          <button>Modules</button>
          <button>Settings</button>
        </div>
      </nav>
      
      <main className="main-content">
        <header className="hero">
          <h1>Cyber Security Intelligence Suite</h1>
          <p>Protecting your digital assets with advanced AI detection modules.</p>
        </header>

        <section className="dashboard-grid">
          <div className="card">
            <h3>Scam Radar</h3>
            <p>Scanning communications for fraudulent patterns.</p>
            <span className="status-badge low">Low Risk</span>
          </div>
          <div className="card">
            <h3>Behavior Monitor</h3>
            <p>Real-time analysis of system behavior anomalies.</p>
            <span className="status-badge normal">Normal</span>
          </div>
          <div className="card">
            <h3>Fake News Checker</h3>
            <p>Verifying information authenticity using NLP.</p>
            <span className="status-badge safe">Safe</span>
          </div>
          <div className="card">
            <h3>Loan Risk Scanner</h3>
            <p>Predicting financial risks using ML models.</p>
            <span className="status-badge stable">Stable</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        &copy; 2026 CyberRakshak AI. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
