# ClaunNetworking Backend

Backend API para ClaunNetworking Oportunidades - Totalmente independente e pronto para deploy externo.

## 🚀 Início Rápido

### Instalação

```bash
npm install
# ou
pnpm install
```

### Configuração de Variáveis de Ambiente

1. Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis:
```env
DATABASE_URL=mysql://user:password@host:3306/claunnetworking
JWT_SECRET=sua-chave-secreta-super-segura
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Banco de Dados

```bash
# Gerar migrations
npm run db:push

# Seed com dados iniciais
npm run db:seed
```

### Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual (requer token)

### Vagas
- `GET /api/jobs` - Listar vagas com filtros
- `GET /api/jobs/:id` - Obter vaga específica
- `POST /api/jobs` - Criar vaga (admin)
- `PUT /api/jobs/:id` - Atualizar vaga (admin)
- `DELETE /api/jobs/:id` - Deletar vaga (admin)
- `POST /api/jobs/:id/click` - Registrar clique

### Cursos
- `GET /api/courses` - Listar cursos com filtros
- `GET /api/courses/:id` - Obter curso específico
- `POST /api/courses` - Criar curso (admin)
- `PUT /api/courses/:id` - Atualizar curso (admin)
- `DELETE /api/courses/:id` - Deletar curso (admin)
- `POST /api/courses/:id/click` - Registrar clique

### Métricas (requer autenticação)
- `GET /api/metrics/dashboard` - Dashboard com estatísticas
- `GET /api/metrics/clicks-timeline` - Timeline de cliques
- `GET /api/metrics/resources/:type` - Analytics de recursos

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Fluxo de Login

1. Usuário faz login com email/senha
2. Backend retorna um token JWT
3. Cliente envia o token no header `Authorization: Bearer <token>`
4. Backend valida o token em rotas protegidas

### Headers Obrigatórios

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema
- **jobs** - Vagas de emprego
- **courses** - Cursos e treinamentos
- **click_metrics** - Métricas de cliques
- **site_visits** - Visitas ao site
- **shortened_links** - Links encurtados

## 🚀 Deploy no Railway

### Pré-requisitos
- Conta no Railway.app
- Banco de dados MySQL (TiDB ou outro)

### Passos

1. **Conectar repositório**
   - Faça push do código para GitHub
   - Conecte o repositório no Railway

2. **Configurar variáveis de ambiente**
   - `DATABASE_URL` - Connection string do banco
   - `JWT_SECRET` - Chave secreta para JWT
   - `FRONTEND_URL` - URL do frontend
   - `NODE_ENV` - production

3. **Deploy automático**
   - Railway fará deploy automaticamente a cada push

4. **Verificar saúde**
   ```bash
   curl https://seu-backend.railway.app/api/health
   ```

## 📝 Exemplo de Uso

### Registrar usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123",
    "name": "João Silva"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

### Listar vagas

```bash
curl http://localhost:3000/api/jobs?category=tecnologia&modality=Remoto
```

### Criar vaga (admin)

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Desenvolvedor Full Stack",
    "company": "Tech Company",
    "description": "Procuramos um desenvolvedor experiente...",
    "link": "https://example.com/job",
    "city": "São Paulo",
    "state": "SP",
    "modality": "Remoto",
    "category": "tecnologia"
  }'
```

## 🔧 Troubleshooting

### Erro de conexão com banco de dados
- Verifique `DATABASE_URL`
- Certifique-se de que o banco está acessível
- Verifique firewall/security groups

### Erro de CORS
- Verifique `FRONTEND_URL` em `.env`
- Certifique-se de que o frontend está usando a URL correta

### Erro de JWT
- Regenere `JWT_SECRET`
- Certifique-se de que o token não expirou

## 📄 Licença

MIT
