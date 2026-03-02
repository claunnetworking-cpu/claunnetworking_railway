-- ClaunNetworking v5.3.0 — Migration 002: Seed / Demo Data
-- Creates a demo tenant, admin user (password: Admin@1234) and sample records.
BEGIN;

-- Demo tenant
INSERT INTO tenants (id, name, plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Tenant Demo', 'pro')
ON CONFLICT DO NOTHING;

-- Admin user — password hash for "Admin@1234" (bcrypt cost 10)
-- Change in production!
INSERT INTO users (tenant_id, email, password_hash, role) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@claunnetworking.com',
    '$2b$10$X9h8ZQn1wN6YvK3LmR7uAe1BXzT4pS5qJ0rH2dF8vM3kO6nW9yL1i',
    'admin'
  )
ON CONFLICT DO NOTHING;

-- Subscription
INSERT INTO subscriptions (tenant_id, status, price, current_period_end) VALUES
  ('00000000-0000-0000-0000-000000000001', 'active', 299.90, NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- Sample financial transactions
INSERT INTO financial_transactions (tenant_id, amount, type, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 299.90, 'subscription', 'paid', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000001', 299.90, 'subscription', 'paid', NOW() - INTERVAL '35 days'),
  ('00000000-0000-0000-0000-000000000001', 150.00, 'credit_purchase', 'paid', NOW() - INTERVAL '10 days'),
  ('00000000-0000-0000-0000-000000000001', 50.00,  'overage', 'paid', NOW() - INTERVAL '15 days');

-- Sample jobs (tenant-scoped)
INSERT INTO jobs (tenant_id, title, company, description, city, state, modality, is_pcd, category, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Analista de RH', 'Empresa Demo', 'Vaga para analista de recursos humanos.', 'São Paulo', 'SP', 'presencial', false, 'administrativo', 'ativa'),
  ('00000000-0000-0000-0000-000000000001', 'Desenvolvedor Full Stack', 'Tech Demo', 'Vaga para dev full stack.', 'Remoto', '', 'remoto', false, 'tecnologia', 'ativa'),
  ('00000000-0000-0000-0000-000000000001', 'Designer UX/UI', 'Creative Demo', 'Vaga para designer.', 'Belo Horizonte', 'MG', 'híbrido', false, 'design', 'ativa');

-- Sample courses
INSERT INTO courses (tenant_id, title, institution, description, duration, modality, is_free, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Excel Avançado', 'EV.ORG.BR', 'Aprenda Excel do básico ao avançado.', '40h', 'online', true, 'ativo'),
  ('00000000-0000-0000-0000-000000000001', 'Marketing Digital', 'Alura', 'Fundamentos do marketing digital.', '60h', 'online', false, 'ativo');

COMMIT;
