-- ClaunNetworking v5.1.1 - PostgreSQL multi-tenant (RLS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(100) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  price NUMERIC(12,2) DEFAULT 0,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  resource_type VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 0,
  month_year VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (tenant_id, resource_type, month_year)
);

CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  type VARCHAR(50) NOT NULL,        -- subscription, overage, credit_purchase, refund, etc.
  status VARCHAR(50) NOT NULL,      -- paid, pending, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------
-- Row Level Security (RLS)
-- ---------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: isolate by session setting 'app.current_tenant'
DROP POLICY IF EXISTS tenant_users_policy ON users;
CREATE POLICY tenant_users_policy ON users
USING (tenant_id::text = current_setting('app.current_tenant', true));

DROP POLICY IF EXISTS tenant_subs_policy ON subscriptions;
CREATE POLICY tenant_subs_policy ON subscriptions
USING (tenant_id::text = current_setting('app.current_tenant', true));

DROP POLICY IF EXISTS tenant_usage_policy ON usage_tracking;
CREATE POLICY tenant_usage_policy ON usage_tracking
USING (tenant_id::text = current_setting('app.current_tenant', true));

DROP POLICY IF EXISTS tenant_finance_policy ON financial_transactions;
CREATE POLICY tenant_finance_policy ON financial_transactions
USING (tenant_id::text = current_setting('app.current_tenant', true));

-- Optional: create a test tenant + data (adjust/remove in prod)
-- INSERT INTO tenants (name, plan) VALUES ('Tenant Demo', 'pro') RETURNING id;
