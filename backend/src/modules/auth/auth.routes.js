// src/modules/auth/auth.routes.js
const express = require('express');
const { z } = require('zod');
const { pool, withTenant } = require('../../db');
const { signToken, comparePassword, hashPassword, requireAuth } = require('./auth');

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantId: z.string().uuid().optional(),
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.', details: body.error.flatten() });

    const { email, password, tenantId } = body.data;

    // Find user across tenants or within a specific tenant
    let query, params;
    if (tenantId) {
      query = 'SELECT * FROM users WHERE email = $1 AND tenant_id = $2 LIMIT 1';
      params = [email, tenantId];
    } else {
      query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
      params = [email];
    }

    const client = await pool.connect();
    let user;
    try {
      const result = await client.query(query, params);
      user = result.rows[0];
    } finally {
      client.release();
    }

    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = signToken({
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
    });
  } catch (e) { next(e); }
});

// GET /auth/me — returns current user from token
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// POST /auth/change-password
router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(6),
      newPassword: z.string().min(8),
    });
    const body = schema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'Dados inválidos.', details: body.error.flatten() });

    const { currentPassword, newPassword } = body.data;

    return withTenant(req.user.tenantId, async (client) => {
      const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
      const user = rows[0];
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

      const valid = await comparePassword(currentPassword, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Senha atual incorreta.' });

      const hash = await hashPassword(newPassword);
      await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, user.id]);
      res.json({ message: 'Senha alterada com sucesso.' });
    });
  } catch (e) { next(e); }
});

module.exports = router;
