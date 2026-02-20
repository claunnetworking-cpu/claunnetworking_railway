import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import { generateToken, verifyToken, AuthRequest } from '../middleware/auth.js';

export default function authRoutes(db: any) {
  const router = Router();

  // Register
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Check if user exists
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await db.insert(schema.users).values({
        email,
        password: hashedPassword,
        name: name || email,
        role: 'user',
      });

      const token = generateToken(result.insertId, email, 'user');

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: { id: result.insertId, email, name, role: 'user' },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  });

  // Login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Find user
      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const user = users[0];

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Generate token
      const token = generateToken(user.id, user.email, user.role);

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  });

  // Get Current User
  router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, req.user!.id));

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
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  });

  return router;
}
