import { Router, Request, Response } from 'express';
import { eq, and, like, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '../db/schema.js';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

export default function jobsRoutes(db: any) {
  const router = Router();

  // Get all jobs with filters
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { category, modality, isPCD, status, search } = req.query;

      let query = db.select().from(schema.jobs);

      // Apply filters
      const conditions = [];
      
      if (status) {
        conditions.push(eq(schema.jobs.status, status as string));
      } else {
        conditions.push(eq(schema.jobs.status, 'ativa'));
      }

      if (category) {
        conditions.push(eq(schema.jobs.category, category as string));
      }

      if (modality) {
        conditions.push(eq(schema.jobs.modality, modality as string));
      }

      if (isPCD === 'true') {
        conditions.push(eq(schema.jobs.isPCD, true));
      }

      if (search) {
        conditions.push(
          like(schema.jobs.title, `%${search}%`)
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const jobs = await query.orderBy(desc(schema.jobs.createdAt));

      res.json({
        total: jobs.length,
        jobs,
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
  });

  // Get single job
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const jobs = await db
        .select()
        .from(schema.jobs)
        .where(eq(schema.jobs.id, id));

      if (jobs.length === 0) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      res.json(jobs[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar vaga' });
    }
  });

  // Create job (admin only)
  router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { title, company, description, link, city, state, modality, isPCD, category } = req.body;

      if (!title || !company || !link || !modality) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const jobId = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await db.insert(schema.jobs).values({
        id: jobId,
        title,
        company,
        description,
        link,
        city,
        state,
        modality,
        isPCD: isPCD || false,
        category,
        status: 'ativa',
        expiresAt,
      });

      res.status(201).json({
        message: 'Vaga criada com sucesso',
        id: jobId,
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Erro ao criar vaga' });
    }
  });

  // Update job (admin only)
  router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, company, description, link, city, state, modality, isPCD, category, status } = req.body;

      await db
        .update(schema.jobs)
        .set({
          title,
          company,
          description,
          link,
          city,
          state,
          modality,
          isPCD,
          category,
          status,
          updatedAt: new Date(),
        })
        .where(eq(schema.jobs.id, id));

      res.json({ message: 'Vaga atualizada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar vaga' });
    }
  });

  // Delete job (admin only)
  router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      await db.delete(schema.jobs).where(eq(schema.jobs.id, id));

      res.json({ message: 'Vaga deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar vaga' });
    }
  });

  // Track click
  router.post('/:id/click', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Increment click count
      const jobs = await db
        .select()
        .from(schema.jobs)
        .where(eq(schema.jobs.id, id));

      if (jobs.length === 0) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      await db
        .update(schema.jobs)
        .set({ clicks: (jobs[0].clicks || 0) + 1 })
        .where(eq(schema.jobs.id, id));

      // Record metric
      await db.insert(schema.clickMetrics).values({
        id: uuidv4(),
        resourceType: 'job',
        resourceId: id,
        clickType: 'redirect',
      });

      res.json({ message: 'Clique registrado' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar clique' });
    }
  });

  return router;
}
