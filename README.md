# 🚀 ClaunNetworking — Railway + Production Ready (v5.1.1)

Repositório **pronto para subir no GitHub e fazer deploy no Railway**.

## ✅ Inclui
- Backend Node.js/Express pronto para Railway (porta dinâmica `process.env.PORT`)
- PostgreSQL multi-tenant com **Row Level Security (RLS)**
- Painel executivo financeiro:
  - `GET /dashboard/metrics` (MRR/ARR/Churn/TotalRevenue)
- Observabilidade:
  - logs estruturados (Pino)
  - métricas Prometheus (`GET /metrics`)
- Produção:
  - Helmet, Compression, Rate limit
  - validação de ENV via Zod
  - graceful shutdown
- CI/CD:
  - GitHub Actions (`.github/workflows/ci.yml`)
- Deploy:
  - `railway.toml` com healthcheck `/health`

---

## 🚀 Deploy no Railway (passo a passo rápido)
1. Crie um **Project** no Railway
2. **New Service → PostgreSQL**
3. Abra o SQL Editor do Postgres e execute `database/schema.sql`
4. **New Service → Deploy from GitHub Repo**
5. Configure variables no serviço do backend:
   - `DATABASE_URL` (copiada do Postgres)
   - `JWT_SECRET` (>= 16 chars)
   - `NODE_ENV=production`
   - `LOG_LEVEL=info`
6. Teste:
   - `GET /health`
   - `GET /dashboard/metrics` com header `x-tenant-id`

> Rotas tenant-scoped exigem `x-tenant-id` para isolamento via RLS.

---

## 🧪 Rodar local
```bash
cd backend
cp ../.env.example .env
npm i
npm run dev
```

---

## 📚 Documentação
- `docs/DEPLOY_RAILWAY.md` (deploy + notas de RLS)

---

## 🔒 Segurança
Veja `.github/SECURITY.md`.
