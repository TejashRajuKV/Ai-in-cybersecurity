import axios from "axios";
import ENDPOINTS from "./endpoints";

// ─────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});


// ─────────────────────────────────────────
// Scam Radar
// ─────────────────────────────────────────
export const analyzeScam = async (message) => {
  const response = await api.post(ENDPOINTS.SCAM, { message });
  return response.data;
};


// ─────────────────────────────────────────
// Behavior Monitor
// ─────────────────────────────────────────
export const analyzeBehavior = async (behaviorData) => {
  const response = await api.post(ENDPOINTS.BEHAVIOR, behaviorData);
  return response.data;
};


// ─────────────────────────────────────────
// Fake News Checker
// ─────────────────────────────────────────
export const analyzeNews = async (text) => {
  const response = await api.post(ENDPOINTS.FAKENEWS, { text });
  return response.data;
};


// ─────────────────────────────────────────
// Loan Risk Scanner
// ─────────────────────────────────────────
export const scoreLoan = async (appData) => {
  const response = await api.post(ENDPOINTS.LOAN, appData);
  return response.data;
};


// ─────────────────────────────────────────
// Get Loan Rules (for checklist UI)
// ─────────────────────────────────────────
export const getLoanRules = async () => {
  const response = await api.get(ENDPOINTS.LOAN_RULES);
  return response.data;
};


// ─────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────
export const checkHealth = async () => {
  const response = await api.get(ENDPOINTS.HEALTH);
  return response.data;
};


// ─────────────────────────────────────────
// Version Info
// ─────────────────────────────────────────
export const getVersion = async () => {
  const response = await api.get(ENDPOINTS.VERSION);
  return response.data;
};


export default api;
