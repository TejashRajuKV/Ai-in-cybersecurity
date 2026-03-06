import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

export default function App() {
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
