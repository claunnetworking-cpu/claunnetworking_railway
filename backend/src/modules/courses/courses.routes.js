// src/modules/courses/courses.routes.js
const express = require('express');
const { z } = require('zod');
const { withTenant, pool } = require('../../db');
const { requireAuth, requireRole } = require('../auth/auth');
const { tenantRequired } = require('../tenancy/tenantRequired');

const router = express.Router();

const courseSchema = z.object({
  title:       z.string().min(2).max(255),
  institution: z.string().min(1).max(255),
  description: z.string().optional(),
  link:        z.string().url().optional().or(z.literal('')),
  duration:    z.string().optional(),
  modality:    z.enum(['online', 'presencial', 'híbrido']).default('online'),
  isFree:      z.boolean().default(true),
  status:      z.enum(['ativo', 'encerrado']).default('ativo'),
});

// GET /courses — public listing
router.get('/', async (req, res, next) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    const { status = 'ativo', modality, isFree, search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = ['status = $1'];
    const params = [status];
    let idx = 2;

    if (modality) { conditions.push(`modality = $${idx++}`); params.push(modality); }
    if (isFree !== undefined) { conditions.push(`is_free = $${idx++}`); params.push(isFree === 'true'); }
    if (search) { conditions.push(`(title ILIKE $${idx} OR institution ILIKE $${idx++})`); params.push(`%${search}%`); }

    const where = conditions.join(' AND ');
    const baseQuery = `SELECT * FROM courses WHERE ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    const countQuery = `SELECT COUNT(*) FROM courses WHERE ${where}`;
    params.push(Number(limit), offset);

    const doQuery = async (client) => {
      const rows  = await client.query(baseQuery, params);
      const count = await client.query(countQuery, params.slice(0, -2));
      return { courses: rows.rows, total: Number(count.rows[0].count) };
    };

    if (tenantId) {
      return res.json(await withTenant(tenantId, doQuery));
    }
    const client = await pool.connect();
    try { res.json(await doQuery(client)); } finally { client.release(); }
  } catch (e) { next(e); }
});

// GET /courses/:id
router.get('/:id', async (req, res, next) => {
  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'Curso não encontrado.' });
      res.json(rows[0]);
    } finally { client.release(); }
  } catch (e) { next(e); }
});

// POST /courses
router.post('/', requireAuth, tenantRequired, async (req, res, next) => {
  try {
    const body = courseSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.', details: body.error.flatten() });

    const { title, institution, description, link, duration, modality, isFree, status } = body.data;
    const tenantId = req.user.tenantId;

    const data = await withTenant(tenantId, async (client) => {
      const { rows } = await client.query(
        `INSERT INTO courses (tenant_id, title, institution, description, link, duration, modality, is_free, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [tenantId, title, institution, description, link, duration, modality, isFree, status]
      );
      return rows[0];
    });

    res.status(201).json(data);
  } catch (e) { next(e); }
});

// PATCH /courses/:id
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const body = courseSchema.partial().safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.', details: body.error.flatten() });

    const tenantId = req.user.tenantId;
    const map = { isFree: 'is_free' };
    const fields = Object.keys(body.data).map((k, i) => `${map[k] || k} = $${i + 2}`).join(', ');
    const values = Object.values(body.data);
    if (!values.length) return res.status(400).json({ error: 'Nenhum campo para atualizar.' });

    const data = await withTenant(tenantId, async (client) => {
      const { rows } = await client.query(
        `UPDATE courses SET ${fields} WHERE id = $1 AND tenant_id = '${tenantId}' RETURNING *`,
        [req.params.id, ...values]
      );
      return rows[0];
    });

    if (!data) return res.status(404).json({ error: 'Curso não encontrado.' });
    res.json(data);
  } catch (e) { next(e); }
});

// DELETE /courses/:id
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    await withTenant(tenantId, async (client) => {
      await client.query(`DELETE FROM courses WHERE id = $1 AND tenant_id = '${tenantId}'`, [req.params.id]);
    });
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
