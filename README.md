# ClaunNetworking v5.2.1 — Fullstack (UI original) + Railway via GitHub

## Estrutura
- `backend/` API Node/Express (Railway-ready, multi-tenant RLS)
- `frontend/` UI baseada no layout original
- `database/` schema SQL para PostgreSQL (Railway)

## Deploy no Railway via GitHub (2 serviços no mesmo repo)
Você vai criar **dois serviços** no Railway apontando para subdiretórios.

### 1) Backend
1. Railway → New Project → New Service → **Deploy from GitHub Repo**
2. Escolha este repositório
3. Em **Settings → Root Directory** coloque: `backend`
4. Em **Variables**:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (ou o valor do seu Postgres)
   - `JWT_SECRET` = (>= 16 caracteres)
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://DOMINIO_DO_FRONTEND` (recomendado)
5. Abra a URL do serviço e teste:
   - `GET /health`

### 2) PostgreSQL
1. No mesmo Project: New Service → **PostgreSQL**
2. Execute `database/schema.sql` (via DBeaver/psql)
3. Crie um tenant demo:
   ```sql
   INSERT INTO tenants (name, plan) VALUES ('Tenant Demo','pro') RETURNING id;
   ```

### 3) Frontend
1. Railway → New Service → **Deploy from GitHub Repo**
2. Selecione o mesmo repositório
3. Em **Settings → Root Directory** coloque: `frontend`
4. Em **Variables**:
   - `VITE_API_URL` = `https://DOMINIO_DO_BACKEND.up.railway.app`
   - `VITE_DEFAULT_TENANT_ID` = `UUID do tenant criado`
5. Após deploy, acesse:
   - `/admin/finance`

## Testes de integração
- Backend: `/health` deve retornar 200
- Frontend: `/admin/finance` deve carregar métricas ao informar `tenant_id`
- Observabilidade: Backend `/metrics` (Prometheus)
