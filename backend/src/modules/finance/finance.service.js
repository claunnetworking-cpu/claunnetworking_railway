const { withTenant } = require('../../db');

// Finance metrics are typically global OR per tenant.
// This version supports both:
// - If x-tenant-id is provided, it scopes queries to that tenant via RLS.
// - If not provided, it runs global queries without RLS (not recommended unless you use an admin DB role).
async function getMRR(client) {
  const r = await client.query(`
    SELECT COALESCE(SUM(amount),0) as mrr
    FROM financial_transactions
    WHERE status = 'paid'
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
  `);
  return Number(r.rows[0].mrr || 0);
}

async function getTotalRevenue(client) {
  const r = await client.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM financial_transactions
    WHERE status = 'paid'
  `);
  return Number(r.rows[0].total || 0);
}

async function getChurnRate(client) {
  const total = await client.query(`SELECT COUNT(*)::int AS c FROM tenants`);
  const cancelled = await client.query(`SELECT COUNT(*)::int AS c FROM subscriptions WHERE status = 'cancelled'`);
  const t = total.rows[0].c || 0;
  const c = cancelled.rows[0].c || 0;
  if (t === 0) return 0;
  return (c / t) * 100;
}

async function getDashboardMetrics({ tenantId }) {
  if (tenantId) {
    return withTenant(tenantId, async (client) => {
      const mrr = await getMRR(client);
      const total = await getTotalRevenue(client);
      const churn = await getChurnRate(client);
      return { MRR: mrr, ARR: mrr * 12, TotalRevenue: total, ChurnRate: churn };
    });
  }

  // Global mode (no tenant): for admin use only; requires DB role that can see everything.
  const { pool } = require('../../db');
  const client = await pool.connect();
  try {
    const mrr = await getMRR(client);
    const total = await getTotalRevenue(client);
    const churn = await getChurnRate(client);
    return { MRR: mrr, ARR: mrr * 12, TotalRevenue: total, ChurnRate: churn };
  } finally {
    client.release();
  }
}

module.exports = { getDashboardMetrics };
