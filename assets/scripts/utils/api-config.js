
// Base URL for the ZainojdafMod account backend.
// Change RENDER_URL below once you've deployed backend/ (see backend/README.md).
window._apiBase = (function () {
  const h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3000';

  const RENDER_URL = 'https://REPLACE-ME.onrender.com'; // <-- put your Render URL here
  return RENDER_URL;
}());
