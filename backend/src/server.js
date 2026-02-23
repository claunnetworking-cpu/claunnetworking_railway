require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { env } = require('./config');
const { httpLogger } = require('./modules/observability/httpLogger');
const { router, httpRequestDuration } = require('./routes');

const app = express();

app.disable('x-powered-by');
app.use(httpLogger());
app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use(rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
}));

// Metrics timing middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path || 'unknown';
    end({ method: req.method, route, status: String(res.statusCode) });
  });
  next();
});

app.use('/', router);

// Error handler (no stack leaks in prod)
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Error');
  res.status(status).json({ error: message });
});

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on port ${env.PORT}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`);
  server.close(() => process.exit(0));
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
