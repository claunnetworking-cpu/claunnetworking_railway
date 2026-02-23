/**
 * Minimal smoke test (no DB required):
 * - starts server (requires DATABASE_URL; but does not query DB for /health)
 * This is a lightweight check for CI.
 */
const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: process.env.PORT || 3000, path, method: 'GET' }, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const r = await get('/health');
    if (r.status !== 200) {
      console.error('Smoke test failed:', r.status, r.body);
      process.exit(1);
    }
    console.log('Smoke test OK');
    process.exit(0);
  } catch (e) {
    console.error('Smoke test error:', e);
    process.exit(1);
  }
})();
