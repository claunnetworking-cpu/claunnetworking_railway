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

      // Constrói array de condições
      const conditions = [];

      // Filtro de status (padrão: ativa)
      if (status) {
        const validStatus = status === 'ativa' || status === 'inativa' ? status : null;
        if (validStatus) {
          conditions.push(eq(schema.jobs.status, validStatus));
        } // se inválido, ignora o filtro (ou pode retornar erro)
      } else {
        conditions.push(eq(schema.jobs.status, 'ativa'));
      }

      // Filtro por categoria
      if (category) {
        conditions.push(eq(schema.jobs.category, category as string));
      }

      // Filtro por modalidade
      if (modality) {
        const validModality = ['Presencial', 'Remoto', 'Híbrido'].includes(modality as string)
          ? modality
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
        conditions.push(like(schema.jobs.title, `%${search}%`));
      }

      // Aplica todas as condições com AND
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Executa a consulta ordenada por data de criação (mais recentes primeiro)
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

      // Validação de campos obrigatórios
      if (!title || !company || !link || !modality) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      // Validação de modalidade
      const validModalities = ['Presencial', 'Remoto', 'Híbrido'];
      if (!validModalities.includes(modality)) {
        return res.status(400).json({ error: 'Modalidade inválida' });
      }

      const jobId = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // expira em 30 dias

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
        clicks: 0, // inicializa contador
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

      // Verifica se a vaga existe
      const existing = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id));
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      // Validação de status se fornecido
      if (status && !['ativa', 'inativa'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      // Validação de modalidade se fornecida
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
          updatedAt: new Date(), // se o schema tiver este campo
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

      // Verifica se a vaga existe
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

      // Busca a vaga para garantir que existe
      const jobs = await db
        .select()
        .from(schema.jobs)
        .where(eq(schema.jobs.id, id));

      if (jobs.length === 0) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      // Incrementa o contador de cliques
      await db
        .update(schema.jobs)
        .set({ clicks: (jobs[0].clicks || 0) + 1 })
        .where(eq(schema.jobs.id, id));

      // Registra a métrica
      await db.insert(schema.clickMetrics).values({
        id: uuidv4(),
        resourceType: 'job',
        resourceId: id,
        clickType: 'redirect',
        createdAt: new Date(), // se a tabela tiver este campo
      });

      res.json({ message: 'Clique registrado' });
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      res.status(500).json({ error: 'Erro ao registrar clique' });
    }
  });

  return router;
}