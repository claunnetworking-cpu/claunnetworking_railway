import { Router, Request, Response } from 'express';
import { eq, and, like, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '../db/schema.js';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

/**
 * Rotas para gerenciamento de cursos
 * @param db Instância do drizzle-orm
 */
export default function coursesRoutes(db: any) {
  const router = Router();

  // ============================================
  // GET /api/courses
  // Lista todos os cursos com filtros opcionais
  // ============================================
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { category, modality, isFree, status, search } = req.query;

      let query = db.select().from(schema.courses);

      // Constrói array de condições
      const conditions = [];

      // Filtro de status (padrão: ativo)
      if (status) {
        const statusStr = String(status); // garante que é string
        const validStatus = statusStr === 'ativo' || statusStr === 'inativo' ? statusStr : null;
        if (validStatus) {
          conditions.push(eq(schema.courses.status, validStatus));
        }
      } else {
        conditions.push(eq(schema.courses.status, 'ativo'));
      }

      // Filtro por categoria
      if (category) {
        conditions.push(eq(schema.courses.category, String(category)));
      }

      // Filtro por modalidade
      if (modality) {
        const modalityStr = String(modality);
        const validModality = ['Presencial', 'Híbrido', 'Online'].includes(modalityStr)
          ? modalityStr
          : null;
        if (validModality) {
          conditions.push(eq(schema.courses.modality, validModality));
        }
      }

      // Filtro por gratuito
      if (isFree === 'true') {
        conditions.push(eq(schema.courses.isFree, true));
      }

      // Filtro por busca textual no título
      if (search) {
        conditions.push(like(schema.courses.title, `%${String(search)}%`));
      }

      // Aplica todas as condições com AND
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Executa a consulta ordenada por data de criação (mais recentes primeiro)
      const courses = await query.orderBy(desc(schema.courses.createdAt));

      res.json({
        total: courses.length,
        courses,
      });
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
  });

  // ============================================
  // GET /api/courses/:id
  // Retorna um curso específico
  // ============================================
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const courses = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.id, id));

      if (courses.length === 0) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      res.json(courses[0]);
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
      res.status(500).json({ error: 'Erro ao buscar curso' });
    }
  });

  // ============================================
  // POST /api/courses
  // Cria um novo curso (apenas admin)
  // ============================================
  router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { title, institution, description, link, duration, modality, isFree, category } = req.body;

      if (!title || !institution || !link || !modality) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const validModalities = ['Presencial', 'Híbrido', 'Online'];
      if (!validModalities.includes(modality)) {
        return res.status(400).json({ error: 'Modalidade inválida' });
      }

      const courseId = uuidv4();

      await db.insert(schema.courses).values({
        id: courseId,
        title,
        institution,
        description,
        link,
        duration,
        modality,
        isFree: isFree || false,
        category,
        status: 'ativo',
        clicks: 0,
      });

      res.status(201).json({
        message: 'Curso criado com sucesso',
        id: courseId,
      });
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ error: 'Erro ao criar curso' });
    }
  });

  // ============================================
  // PUT /api/courses/:id
  // Atualiza um curso existente (apenas admin)
  // ============================================
  router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, institution, description, link, duration, modality, isFree, category, status } = req.body;

      if (status && !['ativo', 'inativo'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      if (modality && !['Presencial', 'Híbrido', 'Online'].includes(modality)) {
        return res.status(400).json({ error: 'Modalidade inválida' });
      }

      await db
        .update(schema.courses)
        .set({
          title,
          institution,
          description,
          link,
          duration,
          modality,
          isFree,
          category,
          status,
          updatedAt: new Date(),
        })
        .where(eq(schema.courses.id, id));

      res.json({ message: 'Curso atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
  });

  // ============================================
  // DELETE /api/courses/:id
  // Remove um curso (apenas admin)
  // ============================================
  router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      await db.delete(schema.courses).where(eq(schema.courses.id, id));

      res.json({ message: 'Curso deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      res.status(500).json({ error: 'Erro ao deletar curso' });
    }
  });

  // ============================================
  // POST /api/courses/:id/click
  // Registra um clique no curso (para métricas)
  // ============================================
  router.post('/:id/click', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const courses = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.id, id));

      if (courses.length === 0) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      await db
        .update(schema.courses)
        .set({ clicks: (courses[0].clicks || 0) + 1 })
        .where(eq(schema.courses.id, id));

      await db.insert(schema.clickMetrics).values({
        id: uuidv4(),
        resourceType: 'course',
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