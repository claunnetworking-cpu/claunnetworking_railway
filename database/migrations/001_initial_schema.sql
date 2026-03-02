-- ClaunNetworking v5.3.0 — Migration 001: Initial Schema
-- Run order: must be first migration
BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TENANTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenants (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(255) NOT NULL,
  plan       VARCHAR(100) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── USERS (admin / backoffice) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  DEFAULT 'member',  -- admin | member
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (tenant_id, email)
);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  status              VARCHAR(50) DEFAULT 'active',  -- active | cancelled | past_due
  price               NUMERIC(12,2) DEFAULT 0,
  current_period_end  TIMESTAMP,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── USAGE TRACKING ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_tracking (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  resource_type VARCHAR(100) NOT NULL,
  quantity      INT DEFAULT 0,
  month_year    VARCHAR(7)   NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (tenant_id, resource_type, month_year)
);

-- ─── FINANCIAL TRANSACTIONS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS financial_transactions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount     NUMERIC(12,2) NOT NULL,
  type       VARCHAR(50)   NOT NULL,  -- subscription | overage | credit_purchase | refund
  status     VARCHAR(50)   NOT NULL,  -- paid | pending | failed
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ─── JOBS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  company     VARCHAR(255) NOT NULL,
  description TEXT,
  link        TEXT,
  city        VARCHAR(100),
  state       VARCHAR(50),
  modality    VARCHAR(50) DEFAULT 'presencial',  -- presencial | remoto | híbrido
  is_pcd      BOOLEAN DEFAULT FALSE,
  category    VARCHAR(100),
  status      VARCHAR(50) DEFAULT 'ativa',       -- ativa | encerrada
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── COURSES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  description TEXT,
  link        TEXT,
  duration    VARCHAR(50),
  modality    VARCHAR(50) DEFAULT 'online',  -- online | presencial | híbrido
  is_free     BOOLEAN DEFAULT TRUE,
  status      VARCHAR(50) DEFAULT 'ativo',   -- ativo | encerrado
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── MENTORSHIPS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentorships (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  mentor_name VARCHAR(255) NOT NULL,
  description TEXT,
  link        TEXT,
  modality    VARCHAR(50) DEFAULT 'online',
  is_free     BOOLEAN DEFAULT FALSE,
  status      VARCHAR(50) DEFAULT 'ativo',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking        ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_users          ON users;
DROP POLICY IF EXISTS rls_subscriptions  ON subscriptions;
DROP POLICY IF EXISTS rls_usage          ON usage_tracking;
DROP POLICY IF EXISTS rls_finance        ON financial_transactions;
DROP POLICY IF EXISTS rls_jobs           ON jobs;
DROP POLICY IF EXISTS rls_courses        ON courses;
DROP POLICY IF EXISTS rls_mentorships    ON mentorships;

CREATE POLICY rls_users          ON users                  USING (tenant_id::text = current_setting('app.current_tenant', true));
CREATE POLICY rls_subscriptions  ON subscriptions          USING (tenant_id::text = current_setting('app.current_tenant', true));
CREATE POLICY rls_usage          ON usage_tracking         USING (tenant_id::text = current_setting('app.current_tenant', true));
CREATE POLICY rls_finance        ON financial_transactions USING (tenant_id::text = current_setting('app.current_tenant', true));
CREATE POLICY rls_jobs           ON jobs                   USING (tenant_id::text = current_setting('app.current_tenant', true));
CREATE POLICY rls_courses        ON courses                USING (tenant_id::text = current_setting('app.current_tenant', true));
CREATE POLICY rls_mentorships    ON mentorships            USING (tenant_id::text = current_setting('app.current_tenant', true));

COMMIT;
