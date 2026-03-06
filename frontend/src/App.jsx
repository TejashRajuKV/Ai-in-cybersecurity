import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Preloader from "./components/Preloader";
import "./styles/global.css";

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <BrowserRouter>
      {/* ── Navbar always visible ── */}
      <Navbar />

      {/* ── Routes ── */}
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch all → redirect to home */}
        <Route path="*" element={<Navigate to="/" />}   />
      </Routes>
    </BrowserRouter>
  );
}
