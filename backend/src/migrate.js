// src/migrate.js
// Runs SQL migration files in order. Safe to run multiple times (tracks applied migrations).
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { env } = require('./config');

const MIGRATIONS_DIR = process.env.MIGRATIONS_DIR ||
  path.resolve(__dirname, '../../database/migrations');

async function run() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const client = await pool.connect();
  try {
    // Create tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL PRIMARY KEY,
        filename   VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const applied = await client.query('SELECT filename FROM _migrations ORDER BY id');
    const appliedSet = new Set(applied.rows.map(r => r.filename));

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`[migrate] skip  ${file} (already applied)`);
        continue;
      }
      console.log(`[migrate] apply ${file}`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      console.log(`[migrate] done  ${file}`);
    }

    console.log('[migrate] All migrations applied.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('[migrate] ERROR:', err.message);
  process.exit(1);
});
