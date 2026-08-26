// Local development uses the local FastAPI service. For a deployed static host,
// define window.ZAMEEN_DEPLOYED_API_URL before this file or replace the empty
// value below with the exact deployed FastAPI origin (no trailing slash).
const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
window.ZAMEEN_CONFIG = {
  API_BASE_URL: isLocalHost ? 'http://127.0.0.1:8000' : (window.ZAMEEN_DEPLOYED_API_URL || ''),
};
