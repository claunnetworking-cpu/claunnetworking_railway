const pino = require('pino');
const { env } = require('../../config');

const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'claunnetworking', env: env.NODE_ENV }
});

module.exports = { logger };
