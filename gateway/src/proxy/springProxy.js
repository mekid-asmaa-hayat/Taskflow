const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

const springProxy = createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      res.status(502).json({ message: 'Backend unavailable' });
    }
  }
});

module.exports = { springProxy };
