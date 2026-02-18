# 🚀 Claunnetworking Oportunidades - Documentação de Produção

## 📋 Visão Geral

**Claunnetworking Oportunidades** é uma plataforma web completa para gerenciar e divulgar vagas de emprego e cursos de capacitação. Desenvolvida com React 19, Node.js, tRPC e MySQL, oferece:

- ✅ Interface responsiva e moderna
- ✅ Sistema de autenticação OAuth integrado (Manus)
- ✅ Gerenciamento dinâmico de vagas e cursos
- ✅ Dashboard de analytics avançado
- ✅ Rastreamento de conversões e origem de tráfego
- ✅ Botões de ações (Editar, Inativar, Remover) em tabelas admin
- ✅ Exportação de relatórios em PDF

---

## 🏗️ Arquitetura

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Vite |
| **Backend** | Node.js, Express, tRPC 11 |
| **Banco de Dados** | MySQL / TiDB |
| **ORM** | Drizzle ORM |
| **Autenticação** | Manus OAuth |
| **Hospedagem** | Railway.app |
| **APIs** | Manus Built-in APIs (LLM, Storage, Notifications) |

### Estrutura de Pastas

```
claunnetworking-oportunidades/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas (Home, Jobs, Courses, Admin, etc)
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── lib/                    # Utilitários (tRPC, mockData)
│   │   ├── _core/hooks/            # Custom hooks (useAuth)
│   │   └── App.tsx                 # Roteamento principal
│   └── public/                     # Assets estáticos
├── server/                          # Backend Node.js
│   ├── routers.ts                  # Procedures tRPC
│   ├── db.ts                       # Query helpers
│   ├── storage.ts                  # S3 helpers
│   └── _core/                      # Framework (OAuth, LLM, etc)
├── drizzle/                         # Schema e migrations
│   ├── schema.ts                   # Definição de tabelas
│   └── migrations/                 # Histórico de migrations
├── shared/                          # Código compartilhado
├── RAILWAY_DEPLOYMENT.md            # Guia de deployment
├── railway.json                     # Config Railway
├── Procfile                         # Config Heroku/Railway
└── package.json                     # Dependências
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

#### `jobs` - Vagas de Emprego
```sql
CREATE TABLE jobs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(2),
  modality ENUM('Presencial', 'Remoto', 'Híbrido'),
  isPCD BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  category VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `courses` - Cursos
```sql
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(500),
  duration VARCHAR(50),
  modality ENUM('Online', 'Presencial', 'Híbrido'),
  isFree BOOLEAN DEFAULT true,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `events` - Rastreamento de Eventos
```sql
CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY,
  resourceType ENUM('job', 'course', 'link'),
  resourceId VARCHAR(36),
  eventType ENUM('view', 'click', 'redirect', 'share'),
  source VARCHAR(100),
  userId VARCHAR(36),
  sessionId VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `conversions` - Conversões
```sql
CREATE TABLE conversions (
  id VARCHAR(36) PRIMARY KEY,
  resourceId VARCHAR(36),
  resourceType ENUM('job', 'course', 'link'),
  conversionCount INT DEFAULT 0,
  lastConversionAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔐 Autenticação

### Fluxo OAuth (Manus)

1. Usuário clica em "Acessar Painel"
2. Redirecionado para `VITE_OAUTH_PORTAL_URL`
3. Realiza login/cadastro no Manus
4. Redirecionado para `/api/oauth/callback`
5. Backend valida token e cria sessão
6. Usuário autenticado no dashboard admin

### Roles de Usuário

- **admin**: Acesso total ao painel administrativo
- **user**: Acesso limitado (apenas visualização)

---

## 📊 APIs Principais

### tRPC Procedures

#### Jobs
- `jobs.list` - Listar todas as vagas
- `jobs.create` - Criar nova vaga
- `jobs.update` - Atualizar vaga
- `jobs.delete` - Deletar vaga
- `jobs.getById` - Obter vaga por ID

#### Courses
- `courses.list` - Listar todos os cursos
- `courses.create` - Criar novo curso
- `courses.update` - Atualizar curso
- `courses.delete` - Deletar curso
- `courses.getById` - Obter curso por ID

#### Analytics
- `metrics.getOverview` - Visitas, cliques, redirecionamentos
- `metrics.getTopResources` - Top vagas/cursos por conversão
- `metrics.getPeriodMetrics` - Métricas por período

#### Extractors (IA)
- `extract.job` - Extrair dados de vaga via IA
- `extract.course` - Extrair dados de curso via IA

#### Auth
- `auth.me` - Obter usuário atual
- `auth.logout` - Logout

---

## 🚀 Deployment no Railway

### Pré-requisitos

- [ ] Conta no Railway.app
- [ ] Repositório GitHub público
- [ ] Variáveis de ambiente configuradas

### Passos

1. **Push para GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Conectar Railway**
   - Acesse railway.app
   - Clique em "New Project"
   - Selecione "Deploy from GitHub"
   - Autorize e selecione o repositório

3. **Configurar Banco de Dados**
   - Clique em "+ Add Service"
   - Selecione "MySQL"
   - Railway criará automaticamente

4. **Adicionar Variáveis**
   - Vá para "Variables"
   - Adicione todas as variáveis do `.env.example`
   - Railway preencherá `DATABASE_URL` automaticamente

5. **Deploy**
   - Railway fará build e deploy automaticamente
   - Acesse o domínio fornecido

### Monitoramento

- **Logs**: Railway → Logs
- **Métricas**: Railway → Metrics
- **Deployments**: Railway → Deployments

---

## 📈 Funcionalidades Principais

### 1. Gerenciamento de Vagas

**Admin:**
- Adicionar vaga (com extração automática via IA)
- Editar vaga
- Inativar/Ativar vaga
- Remover vaga
- Visualizar analytics por vaga

**Usuário:**
- Visualizar lista de vagas
- Filtrar por modalidade (Remoto, Presencial, Híbrido)
- Filtrar vagas PCD
- Clicar para acessar vaga externa

### 2. Gerenciamento de Cursos

**Admin:**
- Adicionar curso (com extração automática via IA)
- Editar curso
- Inativar/Ativar curso
- Remover curso
- Badge "Grátis" automático

**Usuário:**
- Visualizar lista de cursos
- Filtrar por modalidade
- Clicar para acessar curso externo

### 3. Dashboard Analytics

**Métricas:**
- Total de visitas
- Total de cliques
- Total de redirecionamentos
- Total de compartilhamentos

**Gráficos:**
- Top vagas/cursos por conversão
- Distribuição de origem de tráfego (Direto, Referência, Busca)

**Exportação:**
- Exportar relatório em TXT
- Filtrar por período (7, 30, 90 dias, 1 ano)

### 4. Ações em Tabelas

**Botões de Ação:**
- ✏️ Editar - Abre formulário pré-preenchido
- 👁️ Inativar - Alterna status (Eye/EyeOff)
- 🗑️ Remover - Deleta com confirmação

---

## 🔧 Configuração Local (Desenvolvimento)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/SEU_USUARIO/claunnetworking-oportunidades.git
cd claunnetworking-oportunidades

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com seus valores

# Setup banco de dados
npm run db:push

# Iniciar servidor de desenvolvimento
npm run dev
```

### URLs Locais

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API tRPC**: http://localhost:3000/api/trpc

---

## 🧪 Testes

```bash
# Rodar testes
npm run test

# Rodar testes com coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

---

## 📝 Variáveis de Ambiente Críticas

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Conexão MySQL | `mysql://user:pass@host/db` |
| `JWT_SECRET` | Chave para sessão | `openssl rand -base64 32` |
| `VITE_APP_ID` | ID da app Manus | `app_xxxxx` |
| `OAUTH_SERVER_URL` | URL OAuth Manus | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL portal login | `https://portal.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | API key Manus | `key_xxxxx` |

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
npm run build
```

### Erro: "Database connection failed"
- Verificar `DATABASE_URL`
- Confirmar que MySQL está rodando
- Testar conexão: `mysql -u user -p -h host`

### Erro: "OAuth callback failed"
- Confirmar `VITE_OAUTH_PORTAL_URL`
- Adicionar domínio à lista de redirect URIs
- Verificar `VITE_APP_ID`

### Erro: "Build timeout"
- Aumentar timeout no Railway
- Verificar se há muitas dependências
- Limpar cache: `npm cache clean --force`

---

## 📞 Suporte e Documentação

- **Railway Docs**: https://docs.railway.app
- **Manus Docs**: https://docs.manus.im
- **tRPC Docs**: https://trpc.io
- **Drizzle Docs**: https://orm.drizzle.team
- **React Docs**: https://react.dev

---

## 📄 Licença

Este projeto é propriedade da Claunnetworking.

---

## ✅ Checklist de Deployment

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados MySQL criado
- [ ] Migrations executadas (`npm run db:push`)
- [ ] Build local testado (`npm run build`)
- [ ] Testes passando (`npm run test`)
- [ ] Código commitado e pushed para GitHub
- [ ] Railway conectado ao repositório
- [ ] Deploy completado com sucesso
- [ ] Domínio acessível
- [ ] OAuth funcionando
- [ ] Analytics registrando eventos
- [ ] Backups configurados

---

**Última atualização:** Fevereiro 2026
**Versão:** 1.0.0
**Status:** Production Ready ✅
