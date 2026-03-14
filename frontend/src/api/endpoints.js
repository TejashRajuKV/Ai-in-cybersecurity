// ─────────────────────────────────────────
// Base URL from .env file
// ─────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

// ─────────────────────────────────────────
// All API Endpoints
// ─────────────────────────────────────────
const ENDPOINTS = {
    // ── Detection Modules ──
    SCAM: `${BASE_URL}/api/scam`,
    BEHAVIOR: `${BASE_URL}/api/behavior`,
    FAKENEWS: `${BASE_URL}/api/fakenews`,
    LOAN: `${BASE_URL}/api/loan`,
    LOAN_RULES: `${BASE_URL}/api/loan/rules`,
    PHISHING: `${BASE_URL}/api/phishing`,
    TOXICITY: `${BASE_URL}/api/toxicity`,
    THREAT: `${BASE_URL}/api/threat`,

    // ── System ──
    HEALTH: `${BASE_URL}/api/health`,
    VERSION: `${BASE_URL}/api/version`,
};

export default ENDPOINTS;
