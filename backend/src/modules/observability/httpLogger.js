const pinoHttp = require('pino-http');
const { logger } = require('./logger');

function httpLogger() {
  return pinoHttp({
    logger,
    customProps: (req) => ({
      tenant_id: req.headers['x-tenant-id'] || null
    })
  });
}

module.exports = { httpLogger };
