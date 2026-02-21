import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import { generateToken, verifyToken, AuthRequest } from '../middleware/auth.js';

/**
 * Rotas de autenticação
 * @param db Instância do drizzle-orm
 */
export default function authRoutes(db: any) {
  const router = Router();

  /**
   * POST /api/auth/register
   * Registra um novo usuário
   */
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Verifica se usuário já existe
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere novo usuário
      // Nota: em MySQL, o drizzle retorna um objeto com insertId (auto-increment)
      const result = await db.insert(schema.users).values({
        email,
        password: hashedPassword,
        name: name || email.split('@')[0] || 'Usuário',
        role: 'user',
      });

      // Gera token JWT
      const token = generateToken(result.insertId, email, 'user');

      // Retorna sucesso
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: result.insertId,
          email,
          name: name || email.split('@')[0],
          role: 'user',
        },
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  });

  /**
   * POST /api/auth/login
   * Autentica um usuário existente
   */
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Busca usuário pelo email
      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const user = users[0];

      // Verifica senha
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gera token
      const token = generateToken(user.id, user.email, user.role);

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  });

  /**
   * GET /api/auth/me
   * Retorna os dados do usuário autenticado
   */
  router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId));

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const user = users[0];
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  });

  return router;
}