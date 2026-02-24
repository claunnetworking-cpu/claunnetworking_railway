# Deploy Fullstack no Railway via GitHub (monorepo)

## A) Criar Postgres
1. Project → New Service → PostgreSQL
2. Copie a variável `DATABASE_URL`

## B) Backend (serviço 1)
1. New Service → Deploy from GitHub
2. Root Directory: `backend`
3. Variables:
   - DATABASE_URL = ${{Postgres.DATABASE_URL}}
   - JWT_SECRET (forte)
   - NODE_ENV=production
   - CORS_ORIGIN=https://<frontend-domain>
4. Deploy e testar `/health`

## C) Criar schema
Execute `database/schema.sql` via DBeaver/psql.

## D) Frontend (serviço 2)
1. New Service → Deploy from GitHub
2. Root Directory: `frontend`
3. Variables:
   - VITE_API_URL = https://<backend-domain>
   - VITE_DEFAULT_TENANT_ID = <uuid>
4. Deploy e acessar `/admin/finance`

## Troubleshooting
- 502/Crash: ver Logs e confirme que o serviço usa `PORT`
- CORS: ajuste `CORS_ORIGIN`
