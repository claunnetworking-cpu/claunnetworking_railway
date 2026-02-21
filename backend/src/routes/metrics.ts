import { Router, Response } from 'express';
import { gte, lte, and, desc } from 'drizzle-orm'; // adicionado desc para ordenação
import * as schema from '../db/schema.js';
import { AuthRequest } from '../middleware/auth.js';

/**
 * Rotas para métricas e analytics
 * @param db Instância do drizzle-orm
 */
export default function metricsRoutes(db: any) {
  const router = Router();

  // ============================================
  // GET /api/metrics/dashboard
  // Estatísticas gerais do dashboard (público ou protegido? Defina conforme necessidade)
  // ============================================
  router.get('/dashboard', async (req: AuthRequest, res: Response) => {
    try {
      // Busca todos os dados necessários
      const jobs = await db.select().from(schema.jobs);
      const courses = await db.select().from(schema.courses);
      const visits = await db.select().from(schema.siteVisits); // assume que tabela existe
      const metrics = await db.select().from(schema.clickMetrics);

      // Cálculos
      const totalClicks = metrics.length;
      const jobClicks = metrics.filter((m: any) => m.resourceType === 'job').length;
      const courseClicks = metrics.filter((m: any) => m.resourceType === 'course').length;

      // Top 5 jobs e courses por cliques
      const topJobs = jobs
        .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5)
        .map((job: any) => ({ id: job.id, title: job.title, company: job.company, clicks: job.clicks || 0 }));

      const topCourses = courses
        .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5)
        .map((course: any) => ({ id: course.id, title: course.title, institution: course.institution, clicks: course.clicks || 0 }));

      res.json({
        totalJobs: jobs.length,
        totalCourses: courses.length,
        totalVisits: visits.length,
        totalClicks,
        jobClicks,
        courseClicks,
        topJobs,
        topCourses,
      });
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      res.status(500).json({ error: 'Erro ao buscar métricas' });
    }
  });

  // ============================================
  // GET /api/metrics/clicks-timeline
  // Retorna número de cliques por dia em um período
  // Params: ?days=30 (padrão)
  // ============================================
  router.get('/clicks-timeline', async (req: AuthRequest, res: Response) => {
    try {
      const { days = 30 } = req.query;
      const daysInt = parseInt(days as string);
      if (isNaN(daysInt) || daysInt <= 0) {
        return res.status(400).json({ error: 'Parâmetro days inválido' });
      }

      // Calcula data de início (UTC para evitar problemas de fuso)
      const startDate = new Date();
      startDate.setUTCDate(startDate.getUTCDate() - daysInt);
      startDate.setUTCHours(0, 0, 0, 0);

      // Busca métricas a partir da data de início
      const metrics = await db
        .select()
        .from(schema.clickMetrics)
        .where(gte(schema.clickMetrics.timestamp, startDate))
        .orderBy(desc(schema.clickMetrics.timestamp)); // ordenação opcional

      // Agrupa por data (YYYY-MM-DD) usando UTC
      const grouped: { [key: string]: number } = {};
      metrics.forEach((m: any) => {
        // Verifica se timestamp existe
        if (!m.timestamp) return;
        const date = new Date(m.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD em UTC
        grouped[date] = (grouped[date] || 0) + 1;
      });

      // Converte para array ordenado por data
      const timeline = Object.entries(grouped)
        .map(([date, count]) => ({ date, clicks: count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      res.json(timeline);
    } catch (error) {
      console.error('Erro ao buscar timeline de cliques:', error);
      res.status(500).json({ error: 'Erro ao buscar timeline de cliques' });
    }
  });

  // ============================================
  // GET /api/metrics/resources/:type
  // Retorna analytics para um tipo de recurso (jobs ou courses)
  // ============================================
  router.get('/resources/:type', async (req: AuthRequest, res: Response) => {
    try {
      const { type } = req.params;

      if (type === 'jobs') {
        const jobs = await db.select().from(schema.jobs);
        // Se houver métricas de clique, pode juntar (opcional)
        const jobMetrics = jobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          clicks: job.clicks || 0,
          whatsappShares: job.whatsappShares || 0, // campo existente? talvez não seja usado
          createdAt: job.createdAt,
        }));
        res.json(jobMetrics);
      } 
      else if (type === 'courses') {
        const courses = await db.select().from(schema.courses);
        const courseMetrics = courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          institution: course.institution,
          clicks: course.clicks || 0,
          whatsappShares: course.whatsappShares || 0,
          createdAt: course.createdAt,
        }));
        res.json(courseMetrics);
      } 
      else {
        res.status(400).json({ error: 'Tipo de recurso inválido. Use "jobs" ou "courses".' });
      }
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
      res.status(500).json({ error: 'Erro ao buscar analytics' });
    }
  });

  // ============================================
  // (Opcional) Adicionar proteção para rotas administrativas
  // Se necessário, descomente as linhas abaixo e adicione os middlewares
  // import { verifyToken, requireAdmin } from '../middleware/auth.js';
  // router.use(verifyToken, requireAdmin); // aplica a todas as rotas acima
  // ============================================

  return router;
}