// courses.ts corrigido
import { Router, Request, Response } from 'express';
import { eq, and, like, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '../db/schema.js';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

export default function coursesRoutes(db: any) {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const { category, modality, isFree, status, search } = req.query;

      let query = db.select().from(schema.courses);
      const conditions = [];

      if (status) {
        const validStatus = status === 'ativo' || status === 'inativo' ? status : 'ativo';
        conditions.push(eq(schema.courses.status, validStatus as 'ativo' | 'inativo'));
      } else {
        conditions.push(eq(schema.courses.status, 'ativo'));
      }

      if (category) {
        conditions.push(eq(schema.courses.category, category as string));
      }

      // ✅ Correção: garantir que modality seja um dos literais permitidos
      if (modality && typeof modality === 'string') {
        if (['Presencial', 'Híbrido', 'Online'].includes(modality)) {
          conditions.push(eq(schema.courses.modality, modality as 'Presencial' | 'Híbrido' | 'Online'));
        }
      }

      if (isFree === 'true') {
        conditions.push(eq(schema.courses.isFree, true));
      }

      if (search && typeof search === 'string') {
        conditions.push(like(schema.courses.title, `%${search}%`));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const courses = await query.orderBy(desc(schema.courses.createdAt));

      res.json({ total: courses.length, courses });
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const courses = await db.select().from(schema.courses).where(eq(schema.courses.id, id));
      if (courses.length === 0) return res.status(404).json({ error: 'Curso não encontrado' });
      res.json(courses[0]);
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
      res.status(500).json({ error: 'Erro ao buscar curso' });
    }
  });

  router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { title, institution, description, link, duration, modality, isFree, category } = req.body;
      if (!title || !institution || !link || !modality) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }
      if (!['Presencial', 'Híbrido', 'Online'].includes(modality)) {
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
      res.status(201).json({ message: 'Curso criado com sucesso', id: courseId });
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ error: 'Erro ao criar curso' });
    }
  });

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
      await db.update(schema.courses).set({
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
      }).where(eq(schema.courses.id, id));
      res.json({ message: 'Curso atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
  });

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

  router.post('/:id/click', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const courses = await db.select().from(schema.courses).where(eq(schema.courses.id, id));
      if (courses.length === 0) return res.status(404).json({ error: 'Curso não encontrado' });
      await db.update(schema.courses).set({ clicks: (courses[0].clicks || 0) + 1 }).where(eq(schema.courses.id, id));
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