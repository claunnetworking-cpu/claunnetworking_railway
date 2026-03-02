// src/modules/jobs/jobs.routes.js
const express = require('express');
const { z } = require('zod');
const { withTenant, pool } = require('../../db');
const { requireAuth, requireRole } = require('../auth/auth');
const { tenantRequired } = require('../tenancy/tenantRequired');

const router = express.Router();

const jobSchema = z.object({
  title:       z.string().min(2).max(255),
  company:     z.string().min(1).max(255),
  description: z.string().optional(),
  link:        z.string().url().optional().or(z.literal('')),
  city:        z.string().optional(),
  state:       z.string().optional(),
  modality:    z.enum(['presencial', 'remoto', 'híbrido']).default('presencial'),
  isPcd:       z.boolean().default(false),
  category:    z.string().optional(),
  status:      z.enum(['ativa', 'encerrada']).default('ativa'),
});

// GET /jobs — public listing (no auth required), filters by tenant if header present
router.get('/', async (req, res, next) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    const { status = 'ativa', modality, isPcd, category, search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = ['status = $1'];
    const params = [status];
    let idx = 2;

    if (modality)  { conditions.push(`modality = $${idx++}`);     params.push(modality); }
    if (isPcd)     { conditions.push(`is_pcd = $${idx++}`);       params.push(isPcd === 'true'); }
    if (category)  { conditions.push(`category = $${idx++}`);     params.push(category); }
    if (search)    { conditions.push(`(title ILIKE $${idx} OR company ILIKE $${idx++})`); params.push(`%${search}%`); }

    const where = conditions.join(' AND ');
    const baseQuery = `SELECT * FROM jobs WHERE ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    const countQuery = `SELECT COUNT(*) FROM jobs WHERE ${where}`;
    params.push(Number(limit), offset);

    if (tenantId) {
      const data = await withTenant(tenantId, async (client) => {
        const rows  = await client.query(baseQuery, params);
        const count = await client.query(countQuery, params.slice(0, -2));
        return { jobs: rows.rows, total: Number(count.rows[0].count) };
      });
      return res.json(data);
    }

    // No tenant: public read without RLS
    const client = await pool.connect();
    try {
      const rows  = await client.query(baseQuery, params);
      const count = await client.query(countQuery, params.slice(0, -2));
      res.json({ jobs: rows.rows, total: Number(count.rows[0].count) });
    } finally { client.release(); }
  } catch (e) { next(e); }
});

// GET /jobs/:id — public
router.get('/:id', async (req, res, next) => {
  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'Vaga não encontrada.' });
      res.json(rows[0]);
    } finally { client.release(); }
  } catch (e) { next(e); }
});

// POST /jobs — requires auth + tenant
router.post('/', requireAuth, tenantRequired, async (req, res, next) => {
  try {
    const body = jobSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.', details: body.error.flatten() });

    const { title, company, description, link, city, state, modality, isPcd, category, status } = body.data;
    const tenantId = req.user.tenantId;

    const data = await withTenant(tenantId, async (client) => {
      const { rows } = await client.query(
        `INSERT INTO jobs (tenant_id, title, company, description, link, city, state, modality, is_pcd, category, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [tenantId, title, company, description, link, city, state, modality, isPcd, category, status]
      );
      return rows[0];
    });

    res.status(201).json(data);
  } catch (e) { next(e); }
});

// PATCH /jobs/:id
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const body = jobSchema.partial().safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.', details: body.error.flatten() });

    const tenantId = req.user.tenantId;
    const fields = Object.entries(body.data)
      .map(([k, _], i) => `${k === 'isPcd' ? 'is_pcd' : k} = $${i + 2}`)
      .join(', ');
    const values = Object.values(body.data);

    if (!values.length) return res.status(400).json({ error: 'Nenhum campo para atualizar.' });

    const data = await withTenant(tenantId, async (client) => {
      const { rows } = await client.query(
        `UPDATE jobs SET ${fields} WHERE id = $1 AND tenant_id = '${tenantId}' RETURNING *`,
        [req.params.id, ...values]
      );
      return rows[0];
    });

    if (!data) return res.status(404).json({ error: 'Vaga não encontrada.' });
    res.json(data);
  } catch (e) { next(e); }
});

// DELETE /jobs/:id
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    await withTenant(tenantId, async (client) => {
      await client.query(`DELETE FROM jobs WHERE id = $1 AND tenant_id = '${tenantId}'`, [req.params.id]);
    });
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
