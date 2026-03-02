// src/routes.js
const express = require('express');
const { tenantRequired } = require('./modules/tenancy/tenantRequired');
const { getDashboardMetrics } = require('./modules/finance/finance.service');
const { client: promClient, httpRequestDuration } = require('./modules/observability/metrics');
const { requireAuth, requireRole } = require('./modules/auth/auth');

// Route modules
const authRoutes    = require('./modules/auth/auth.routes');
const jobsRoutes    = require('./modules/jobs/jobs.routes');
const coursesRoutes = require('./modules/courses/courses.routes');
const tenantsRoutes = require('./modules/tenancy/tenants.routes');

const router = express.Router();

// ─── Health ──────────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '5.3.0' });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ─── Public resources ─────────────────────────────────────────────────────────
router.use('/jobs',    jobsRoutes);
router.use('/courses', coursesRoutes);

// ─── Admin: tenants ───────────────────────────────────────────────────────────
router.use('/tenants', tenantsRoutes);

// ─── Dashboard financeiro (tenant-scoped, auth required) ─────────────────────
router.get('/dashboard/metrics', requireAuth, async (req, res, next) => {
  try {
    const data = await getDashboardMetrics({ tenantId: req.user.tenantId });
    res.json(data);
  } catch (e) { next(e); }
});

// ─── Prometheus metrics ───────────────────────────────────────────────────────
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

module.exports = { router, httpRequestDuration };
