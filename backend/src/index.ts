import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise'; // ✅ usa Pool em vez de Connection
import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './db/schema.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Muitas requisições, tente novamente mais tarde.',
});
app.use('/api/', limiter);

// ============================================
// DATABASE CONNECTION (POOL)
// ============================================

let db: MySql2Database<typeof schema>;

async function initializeDatabase() {
  try {
    const pool = createPool({
      uri: process.env.DATABASE_URL,
      multipleStatements: true,
      waitForConnections: true,
      connectionLimit: 10,
    });
    // Testa a conexão
    await pool.getConnection();
    db = drizzle(pool, { schema, mode: 'default' });
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// ============================================
// START SERVER (após conectar ao banco)
// ============================================
async function startServer() {
  await initializeDatabase();

  // ============================================
  // ROUTES (importadas dinamicamente para evitar acesso prematuro a db)
  // ============================================
  const authRoutes = (await import('./routes/auth.js')).default;
  const jobsRoutes = (await import('./routes/jobs.js')).default;
  const coursesRoutes = (await import('./routes/courses.js')).default;
  const metricsRoutes = (await import('./routes/metrics.js')).default;
  const { verifyToken } = await import('./middleware/auth.js');

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes(db));
  app.use('/api/jobs', jobsRoutes(db));
  app.use('/api/courses', coursesRoutes(db));
  app.use('/api/metrics', verifyToken, metricsRoutes(db));

  // Admin Stats
  app.get('/api/admin/stats', verifyToken, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const jobs = await db.select().from(schema.jobs);
      const courses = await db.select().from(schema.courses);

      res.json({
        jobs: jobs.length,
        courses: courses.length,
        totalClicks: 0,
        totalVisits: 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  });

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  // Error Handler
  app.use((err: any, req: Request, res: Response) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;