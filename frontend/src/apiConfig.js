// Central API configuration
// In Docker/K8s: Nginx proxies /api/v1 to backend (use relative path)
// In local dev (npm run dev): falls back to http://localhost:9000
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
