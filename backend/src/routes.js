const express = require('express');
const { tenantRequired } = require('./modules/tenancy/tenantRequired');
const { getDashboardMetrics } = require('./modules/finance/finance.service');
const { client: promClient, httpRequestDuration } = require('./modules/observability/metrics');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Tenant-scoped dashboard (requires x-tenant-id)
router.get('/dashboard/metrics', tenantRequired, async (req, res, next) => {
  try {
    const data = await getDashboardMetrics({ tenantId: req.tenantId });
    res.json(data);
  } catch (e) { next(e); }
});

// Prometheus metrics endpoint
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

module.exports = { router, httpRequestDuration };
