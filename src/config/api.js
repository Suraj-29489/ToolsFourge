/**
 * Centralized API Configuration for ToolsFourge Frontend.
 * Guarantees all backend API calls target the production Render API endpoint.
 */
const API_BASE = (import.meta.env.VITE_API_URL || 'https://toolsfourgeapi.onrender.com').replace(/\/+$/, '');

export default API_BASE;
