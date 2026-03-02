// src/modules/tenancy/tenants.routes.js
const express = require('express');
const { z } = require('zod');
const { pool } = require('../../db');
const { requireAuth, requireRole } = require('../auth/auth');

const router = express.Router();

// GET /tenants — admin only
router.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM tenants ORDER BY created_at DESC');
      res.json(rows);
    } finally { client.release(); }
  } catch (e) { next(e); }
});

// POST /tenants — admin only
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const schema = z.object({ name: z.string().min(2), plan: z.string().default('free') });
    const body = schema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.' });

    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'INSERT INTO tenants (name, plan) VALUES ($1, $2) RETURNING *',
        [body.data.name, body.data.plan]
      );
      res.status(201).json(rows[0]);
    } finally { client.release(); }
  } catch (e) { next(e); }
});

module.exports = router;
