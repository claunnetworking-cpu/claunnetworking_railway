# ClaunNetworking Oportunidades - Projeto Standalone

Projeto completamente independente do Manus, pronto para deploy externo no Railway ou qualquer outro provedor.

## 📋 Estrutura do Projeto

```
claunnetworking-standalone/
├── backend/                 # API Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts        # Servidor principal
│   │   ├── db/
│   │   │   └── schema.ts   # Schema do banco de dados
│   │   ├── routes/         # Rotas da API
│   │   │   ├── auth.ts     # Autenticação
│   │   │   ├── jobs.ts     # Vagas
│   │   │   ├── courses.ts  # Cursos
│   │   │   └── metrics.ts  # Métricas
│   │   └── middleware/     # Middlewares
│   │       └── auth.ts     # Autenticação JWT
│   ├── .env.example        # Exemplo de variáveis
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   ├── Procfile            # Para Railway
│   └── README.md
│
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas
│   │   ├── components/    # Componentes
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilitários
│   │   └── App.tsx        # Componente raiz
│   ├── .env.example       # Exemplo de variáveis
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── shared/                 # Código compartilhado
│   ├── types.ts           # Tipos TypeScript
│   └── constants.ts       # Constantes
│
├── data/
│   └── sample-data.json   # Dados de exemplo
│
└── README.md              # Este arquivo
```

## 🚀 Quick Start

### Backend

```bash
cd backend
cp .env.example .env
# Configure as variáveis em .env
npm install
npm run db:push
npm run dev
```

Backend estará em: `http://localhost:3000`

### Frontend

```bash
cd frontend
cp .env.example .env
# Configure VITE_API_URL para apontar ao backend
npm install
npm run dev
```

Frontend estará em: `http://localhost:5173`

## 🔧 Configuração de Variáveis de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/claunnetworking

# Server
NODE_ENV=production
PORT=3000

# JWT
JWT_SECRET=sua-chave-secreta-super-segura

# CORS
FRONTEND_URL=https://seu-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
# API
VITE_API_URL=https://seu-backend.railway.app

# App
VITE_APP_NAME=ClaunNetworking Oportunidades
VITE_APP_TITLE=Sua rede de oportunidades

# Environment
VITE_ENV=production
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual

### Vagas
- `GET /api/jobs` - Listar (com filtros)
- `GET /api/jobs/:id` - Detalhe
- `POST /api/jobs` - Criar (admin)
- `PUT /api/jobs/:id` - Atualizar (admin)
- `DELETE /api/jobs/:id` - Deletar (admin)
- `POST /api/jobs/:id/click` - Registrar clique

### Cursos
- `GET /api/courses` - Listar (com filtros)
- `GET /api/courses/:id` - Detalhe
- `POST /api/courses` - Criar (admin)
- `PUT /api/courses/:id` - Atualizar (admin)
- `DELETE /api/courses/:id` - Deletar (admin)
- `POST /api/courses/:id/click` - Registrar clique

### Métricas (protegido)
- `GET /api/metrics/dashboard` - Dashboard
- `GET /api/metrics/clicks-timeline` - Timeline
- `GET /api/metrics/resources/:type` - Analytics

## 🚀 Deploy no Railway

### Passo 1: Preparar Repositório

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Passo 2: Criar Projetos no Railway

1. **Backend**
   - Conectar repositório GitHub
   - Selecionar branch `main`
   - Apontar para pasta `backend/`
   - Adicionar variáveis de ambiente

2. **Frontend**
   - Conectar repositório GitHub
   - Selecionar branch `main`
   - Apontar para pasta `frontend/`
   - Adicionar variáveis de ambiente

3. **Banco de Dados**
   - Criar MySQL/TiDB no Railway
   - Copiar connection string
   - Adicionar em `DATABASE_URL` do backend

### Passo 3: Configurar Variáveis

**Backend (Railway)**
```
DATABASE_URL=mysql://...
JWT_SECRET=sua-chave-secreta
FRONTEND_URL=https://seu-frontend.railway.app
NODE_ENV=production
```

**Frontend (Railway)**
```
VITE_API_URL=https://seu-backend.railway.app
VITE_ENV=production
```

### Passo 4: Deploy

```bash
# Railway fará deploy automaticamente a cada push
git push origin main
```

## 🔐 Segurança

### Checklist de Segurança

- [ ] Alterar `JWT_SECRET` para uma chave forte
- [ ] Configurar CORS corretamente
- [ ] Usar HTTPS em produção
- [ ] Validar todas as entradas
- [ ] Implementar rate limiting
- [ ] Usar variáveis de ambiente
- [ ] Não commitar `.env` no git
- [ ] Implementar autenticação 2FA (opcional)

### Gerar JWT_SECRET Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📊 Dados de Exemplo

O arquivo `data/sample-data.json` contém dados de exemplo para:
- 1 usuário admin
- 5 vagas de emprego
- 5 cursos

Use este arquivo para popular o banco de dados inicialmente.

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- TypeScript
- MySQL + Drizzle ORM
- JWT para autenticação
- Express Rate Limit

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Wouter para roteamento
- Axios para requisições HTTP

## 📖 Documentação Adicional

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Railway Docs](https://docs.railway.app)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique a documentação
2. Abra uma issue no GitHub
3. Entre em contato com o time de desenvolvimento

---

**Pronto para deploy!** 🚀
