# Deploy no Railway (Passo a passo)

1. Crie um **New Project**
2. Clique em **New Service** → **PostgreSQL**
3. Abra o SQL Editor do Postgres e execute `database/schema.sql`
4. Clique em **New Service** → **Deploy from GitHub Repo**
5. Configure variables no serviço do backend:
   - `DATABASE_URL` (do Postgres)
   - `JWT_SECRET` (>= 16 chars)
   - `NODE_ENV=production`
   - `LOG_LEVEL=info`
6. A URL pública do serviço deve responder:
   - `/health` → 200
   - `/dashboard/metrics` com header `x-tenant-id`

## Importante sobre RLS
As rotas tenant-scoped usam `x-tenant-id` e `SET LOCAL app.current_tenant` por request (transação curta),
o que garante isolamento mesmo com pool de conexões.
