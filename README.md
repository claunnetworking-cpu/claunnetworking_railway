# ClaunNetworking v5.3.0 — Fullstack

Plataforma de networking profissional com vagas, cursos e mentorias.  
Backend Node/Express · Frontend React/Vite · PostgreSQL multi-tenant (RLS)

---

## 📦 Publicar no GitHub

```bash
bash setup-github.sh https://github.com/seu-usuario/seu-repo.git
```

O script inicializa o git, configura o remote e faz o primeiro push automaticamente.

---

## 🚀 Deploy local (Docker)

Pré-requisitos: **Docker** e **Docker Compose** instalados.

```bash
# Sobe tudo (cria .env automaticamente se não existir)
bash deploy-local.sh start

# Outros comandos:
bash deploy-local.sh stop              # Para os serviços
bash deploy-local.sh restart           # Recria e reinicia
bash deploy-local.sh logs api          # Logs do backend
bash deploy-local.sh status            # Status + health check
bash deploy-local.sh reset             # Apaga tudo (inclusive banco)
```

Pronto! Acesse:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Health check | http://localhost:3000/health |
| Métricas (Prometheus) | http://localhost:3000/metrics |

**Credenciais de demo:**  
Email: `admin@claunnetworking.com`  
Senha: `Admin@1234`  
*(definidas na migration 002_seed_demo.sql — troque em produção)*

---

## ☁️ Deploy Railway (via GitHub)

```bash
# Instalar Railway CLI (uma vez)
npm install -g @railway/cli
railway login

# Deploy completo com um comando
bash deploy-railway.sh
```

O script cria o projeto, provisiona o PostgreSQL, configura variáveis e faz deploy do backend e frontend automaticamente.

### Manual (alternativa ao script)

#### 1. Banco de dados
- No Railway: New Project → Add Service → PostgreSQL
- Anote a `DATABASE_URL`

#### 2. Backend
- New Service → Deploy from GitHub → Root Directory: `backend`
- Variáveis obrigatórias:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | URL do PostgreSQL Railway |
| `JWT_SECRET` | Mínimo 32 chars. Gere: `openssl rand -hex 32` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | URL do frontend (ex: `https://meusite.up.railway.app`) |

#### 3. Frontend
- New Service → Deploy from GitHub → Root Directory: `frontend`
- Variáveis obrigatórias:

| Variável | Valor |
|---|---|
| `VITE_API_URL` | URL do backend Railway |
| `VITE_DEFAULT_TENANT_ID` | `00000000-0000-0000-0000-000000000001` |

> As migrations rodam automaticamente no `npm start` do backend.

---

## 📁 Estrutura do projeto

```
├── setup-github.sh        Publica no GitHub (git init + push)
├── deploy-local.sh        Deploy local via Docker Compose
├── deploy-railway.sh      Deploy no Railway via CLI
├── docker-compose.yml     Orquestração local completa
├── .env.example           Modelo de variáveis de ambiente
├── backend/               API Node.js/Express
│   └── src/
│       ├── modules/
│       │   ├── auth/          JWT auth + login/me
│       │   ├── jobs/          CRUD de vagas
│       │   ├── courses/       CRUD de cursos
│       │   ├── finance/       Métricas financeiras
│       │   ├── tenancy/       Multi-tenancy RLS
│       │   └── observability/ Logs + Prometheus
│       ├── migrate.js         Runner de migrations
│       └── server.js
├── frontend/              React 18 + Vite + TypeScript
│   └── src/
│       ├── lib/api.ts         Axios + JWT interceptors
│       ├── pages/             ~60 páginas
│       └── components/        UI components
└── database/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_seed_demo.sql
```

---

## 🔐 API — Rotas principais

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Login, retorna JWT |
| GET | `/auth/me` | Dados do usuário logado |
| POST | `/auth/change-password` | Alterar senha |

### Vagas (público)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/jobs` | Lista vagas (filtros: status, modality, category, search) |
| GET | `/jobs/:id` | Detalhe de uma vaga |
| POST | `/jobs` | Criar vaga (requer auth) |
| PATCH | `/jobs/:id` | Editar vaga (requer auth) |
| DELETE | `/jobs/:id` | Remover vaga (requer admin) |

### Cursos (público)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/courses` | Lista cursos |
| GET | `/courses/:id` | Detalhe |
| POST | `/courses` | Criar (requer auth) |
| PATCH | `/courses/:id` | Editar (requer auth) |
| DELETE | `/courses/:id` | Remover (requer admin) |

### Dashboard financeiro
| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/metrics` | MRR, ARR, Churn (requer auth) |

---

## 🔒 Segurança implementada

- **JWT** com expiração de 8h em todo request protegido
- **bcrypt** para hash de senhas (cost 10)
- **Helmet** — headers HTTP seguros
- **Rate limiting** — 300 req/min por IP
- **CORS** configurável por ambiente
- **RLS PostgreSQL** — isolamento de dados por tenant
- **Zod** — validação estrita de inputs em todas as rotas
- **Sem credenciais hardcoded** — tudo via variáveis de ambiente
