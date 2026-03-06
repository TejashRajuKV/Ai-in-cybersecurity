import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      {/* ── Navbar with theme toggle ── */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* ── Routes ── */}
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
