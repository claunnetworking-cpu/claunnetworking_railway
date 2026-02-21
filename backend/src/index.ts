import express, { Express, Request, Response } from 'express';
import cors from 'cors'; // ✅ importação corrigida
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './db/schema.js';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';
import coursesRoutes from './routes/courses.js';
import metricsRoutes from './routes/metrics.js';
import { verifyToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Muitas requisições, tente novamente mais tarde.',
});
app.use('/api/', limiter);

// ============================================
// DATABASE CONNECTION
// ============================================

let db: ReturnType<typeof drizzle>; // tipagem mais precisa (opcional)

async function initializeDatabase() {
  try {
    const connection = await createConnection({
      uri: process.env.DATABASE_URL,
      multipleStatements: true,
    });
    
    db = drizzle(connection, { schema, mode: 'default' }); // ✅ modo explícito
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// ============================================
// ROUTES
// ============================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.use('/api/auth', authRoutes(db));

// Jobs Routes
app.use('/api/jobs', jobsRoutes(db));

// Courses Routes
app.use('/api/courses', coursesRoutes(db));

// Metrics Routes (Protected)
app.use('/api/metrics', verifyToken, metricsRoutes(db));

// Admin Routes
app.get('/api/admin/stats', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // ✅ Correção: obtém os arrays completos e conta os elementos
    const jobs = await db.select().from(schema.jobs);
    const courses = await db.select().from(schema.courses);
    
    res.json({
      jobs: jobs.length,
      courses: courses.length,
      totalClicks: 0, // placeholders, ajuste conforme sua lógica
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

// ============================================
// START SERVER
// ============================================

async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;