// src/modules/auth/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { env } = require('../../config');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '8h';

// ─── Token helpers ────────────────────────────────────────────────────────────

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

// ─── Password helpers ─────────────────────────────────────────────────────────

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// ─── Express middleware ───────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado.' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissão insuficiente.' });
    }
    next();
  };
}

module.exports = { signToken, verifyToken, hashPassword, comparePassword, requireAuth, requireRole };
