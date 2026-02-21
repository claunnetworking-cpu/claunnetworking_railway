import { Router, Request, Response } from 'express';
import { eq, and, like, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '../db/schema.js';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

/**
 * Rotas para gerenciamento de vagas
 * @param db Instância do drizzle-orm
 */
export default function jobsRoutes(db: any) {
  const router = Router();

  // ============================================
  // GET /api/jobs
  // Lista todas as vagas com filtros opcionais
  // ============================================
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { category, modality, isPCD, status, search } = req.query;

      let query = db.select().from(schema.jobs);

      const conditions = [];

      // Filtro de status (padrão: ativa)
      if (status) {
        const statusStr = String(status);
        const validStatus = statusStr === 'ativa' || statusStr === 'inativa' ? statusStr : null;
        if (validStatus) {
          conditions.push(eq(schema.jobs.status, validStatus));
        }
      } else {
        conditions.push(eq(schema.jobs.status, 'ativa'));
      }

      // Filtro por categoria
      if (category) {
        conditions.push(eq(schema.jobs.category, String(category)));
      }

      // Filtro por modalidade
      if (modality) {
        const modalityStr = String(modality);
        const validModality = ['Presencial', 'Remoto', 'Híbrido'].includes(modalityStr)
          ? modalityStr
          : null;
        if (validModality) {
          conditions.push(eq(schema.jobs.modality, validModality));
        }
      }

      // Filtro por vagas exclusivas para PCD
      if (isPCD === 'true') {
        conditions.push(eq(schema.jobs.isPCD, true));
      }

      // Filtro por busca textual no título
      if (search) {
        conditions.push(like(schema.jobs.title, `%${String(search)}%`));
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
      console.error('Erro ao buscar vagas:', error);
      res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
  });

  // ============================================
  // GET /api/jobs/:id
  // Retorna uma vaga específica
  // ============================================
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
      console.error('Erro ao buscar vaga:', error);
      res.status(500).json({ error: 'Erro ao buscar vaga' });
    }
  });

  // ============================================
  // POST /api/jobs
  // Cria uma nova vaga (apenas admin)
  // ============================================
  router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { title, company, description, link, city, state, modality, isPCD, category } = req.body;

      if (!title || !company || !link || !modality) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const validModalities = ['Presencial', 'Remoto', 'Híbrido'];
      if (!validModalities.includes(modality)) {
        return res.status(400).json({ error: 'Modalidade inválida' });
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
        clicks: 0,
        expiresAt,
      });

      res.status(201).json({
        message: 'Vaga criada com sucesso',
        id: jobId,
      });
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      res.status(500).json({ error: 'Erro ao criar vaga' });
    }
  });

  // ============================================
  // PUT /api/jobs/:id
  // Atualiza uma vaga existente (apenas admin)
  // ============================================
  router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, company, description, link, city, state, modality, isPCD, category, status } = req.body;

      const existing = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id));
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      if (status && !['ativa', 'inativa'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      if (modality && !['Presencial', 'Remoto', 'Híbrido'].includes(modality)) {
        return res.status(400).json({ error: 'Modalidade inválida' });
      }

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
      console.error('Erro ao atualizar vaga:', error);
      res.status(500).json({ error: 'Erro ao atualizar vaga' });
    }
  });

  // ============================================
  // DELETE /api/jobs/:id
  // Remove uma vaga (apenas admin)
  // ============================================
  router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const existing = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id));
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      await db.delete(schema.jobs).where(eq(schema.jobs.id, id));

      res.json({ message: 'Vaga deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar vaga:', error);
      res.status(500).json({ error: 'Erro ao deletar vaga' });
    }
  });

  // ============================================
  // POST /api/jobs/:id/click
  // Registra um clique na vaga (para métricas)
  // ============================================
  router.post('/:id/click', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

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

      await db.insert(schema.clickMetrics).values({
        id: uuidv4(),
        resourceType: 'job',
        resourceId: id,
        clickType: 'redirect',
        createdAt: new Date(),
      });

      res.json({ message: 'Clique registrado' });
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      res.status(500).json({ error: 'Erro ao registrar clique' });
    }
  });

  return router;
}