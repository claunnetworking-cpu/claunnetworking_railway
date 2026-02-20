import { Router, Response } from 'express';
import { gte, lte } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import { AuthRequest } from '../middleware/auth.js';

export default function metricsRoutes(db: any) {
  const router = Router();

  // Get dashboard statistics
  router.get('/dashboard', async (req: AuthRequest, res: Response) => {
    try {
      const jobs = await db.select().from(schema.jobs);
      const courses = await db.select().from(schema.courses);
      const visits = await db.select().from(schema.siteVisits);
      const metrics = await db.select().from(schema.clickMetrics);

      const totalClicks = metrics.reduce((sum: number, m: any) => sum + 1, 0);
      const jobClicks = metrics.filter((m: any) => m.resourceType === 'job').length;
      const courseClicks = metrics.filter((m: any) => m.resourceType === 'course').length;

      res.json({
        totalJobs: jobs.length,
        totalCourses: courses.length,
        totalVisits: visits.length,
        totalClicks,
        jobClicks,
        courseClicks,
        topJobs: jobs
          .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
          .slice(0, 5),
        topCourses: courses
          .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
          .slice(0, 5),
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar métricas' });
    }
  });

  // Get clicks over time
  router.get('/clicks-timeline', async (req: AuthRequest, res: Response) => {
    try {
      const { days = 30 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days as string));

      const metrics = await db
        .select()
        .from(schema.clickMetrics)
        .where(gte(schema.clickMetrics.timestamp, startDate));

      // Group by date
      const grouped: { [key: string]: number } = {};
      metrics.forEach((m: any) => {
        const date = new Date(m.timestamp).toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + 1;
      });

      const timeline = Object.entries(grouped).map(([date, count]) => ({
        date,
        clicks: count,
      }));

      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar timeline de cliques' });
    }
  });

  // Get resource analytics
  router.get('/resources/:type', async (req: AuthRequest, res: Response) => {
    try {
      const { type } = req.params;

      if (type === 'jobs') {
        const jobs = await db.select().from(schema.jobs);
        const metrics = await db.select().from(schema.clickMetrics);

        const jobMetrics = jobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          clicks: job.clicks || 0,
          whatsappShares: job.whatsappShares || 0,
          createdAt: job.createdAt,
        }));

        res.json(jobMetrics);
      } else if (type === 'courses') {
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
      } else {
        res.status(400).json({ error: 'Tipo de recurso inválido' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar analytics' });
    }
  });

  return router;
}
