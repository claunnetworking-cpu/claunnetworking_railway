# Guia de Deploy no Railway

Instruções passo a passo para fazer deploy do projeto ClaunNetworking no Railway.

## 📋 Pré-requisitos

- Conta no [Railway.app](https://railway.app)
- Repositório GitHub com o código
- Conta no GitHub

## 🚀 Passo 1: Preparar o Repositório

### 1.1 Estrutura do Git

```bash
# Inicializar git (se ainda não estiver)
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Initial commit: ClaunNetworking standalone project"

# Fazer push para GitHub
git push origin main
```

### 1.2 Estrutura Esperada no GitHub

```
seu-repo/
├── backend/          # Código do backend
├── frontend/         # Código do frontend
├── data/            # Dados de exemplo
└── README.md
```

## 🗄️ Passo 2: Criar Banco de Dados

### 2.1 No Railway Dashboard

1. Ir para [railway.app](https://railway.app)
2. Criar novo projeto
3. Selecionar "MySQL" ou "TiDB"
4. Configurar:
   - Nome: `claunnetworking-db`
   - Região: Escolher a mais próxima
5. Copiar connection string

### 2.2 Formato da Connection String

```
mysql://user:password@host:port/database
```

Exemplo:
```
mysql://root:password123@gateway04.us-east-1.prod.aws.tidbcloud.com:4000/claunnetworking
```

## 🔧 Passo 3: Deploy do Backend

### 3.1 Criar Novo Serviço

1. No Railway Dashboard, clicar "New Service"
2. Selecionar "GitHub Repo"
3. Conectar seu repositório
4. Selecionar branch `main`

### 3.2 Configurar Serviço

1. **Configurações Básicas**
   - Nome: `claunnetworking-backend`
   - Root Directory: `backend/`

2. **Variáveis de Ambiente**
   
   Clicar em "Variables" e adicionar:

   ```
   DATABASE_URL=mysql://user:password@host:port/database
   JWT_SECRET=sua-chave-secreta-super-segura-aqui
   FRONTEND_URL=https://seu-frontend.railway.app
   NODE_ENV=production
   PORT=3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Build & Deploy**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Node Version: `18` ou superior

### 3.3 Gerar JWT_SECRET Seguro

Use um destes comandos:

```bash
# OpenSSL (Linux/Mac)
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3.4 Inicializar Banco de Dados

Após o deploy, executar migrations:

```bash
# No Railway Shell ou localmente
npm run db:push
npm run db:seed
```

## 🎨 Passo 4: Deploy do Frontend

### 4.1 Criar Novo Serviço

1. No Railway Dashboard, clicar "New Service"
2. Selecionar "GitHub Repo"
3. Conectar seu repositório
4. Selecionar branch `main`

### 4.2 Configurar Serviço

1. **Configurações Básicas**
   - Nome: `claunnetworking-frontend`
   - Root Directory: `frontend/`

2. **Variáveis de Ambiente**
   
   Clicar em "Variables" e adicionar:

   ```
   VITE_API_URL=https://seu-backend.railway.app
   VITE_APP_NAME=ClaunNetworking Oportunidades
   VITE_APP_TITLE=Sua rede de oportunidades
   VITE_ENV=production
   ```

3. **Build & Deploy**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   - Node Version: `18` ou superior

### 4.3 Configurar Domínio Customizado (Opcional)

1. No Railway, ir para "Settings"
2. Clicar em "Domain"
3. Adicionar domínio customizado
4. Configurar DNS no seu registrador

## ✅ Passo 5: Verificar Deploy

### 5.1 Testar Backend

```bash
# Health check
curl https://seu-backend.railway.app/api/health

# Resposta esperada:
# {"status":"ok","timestamp":"2026-02-20T..."}
```

### 5.2 Testar Frontend

Abrir em um navegador:
```
https://seu-frontend.railway.app
```

### 5.3 Testar Autenticação

```bash
# Registrar
curl -X POST https://seu-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST https://seu-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔐 Passo 6: Configurar CORS

### 6.1 Backend (.env)

Certifique-se de que `FRONTEND_URL` está correto:

```env
FRONTEND_URL=https://seu-frontend.railway.app
```

### 6.2 Verificar Requisições

No navegador (DevTools), verificar se as requisições para `/api/*` estão funcionando.

## 📊 Passo 7: Monitoramento

### 7.1 Logs

No Railway Dashboard:
1. Selecionar serviço
2. Clicar em "Logs"
3. Monitorar erros e avisos

### 7.2 Métricas

1. Selecionar serviço
2. Clicar em "Metrics"
3. Visualizar:
   - CPU Usage
   - Memory Usage
   - Network I/O

## 🔄 Passo 8: CI/CD Automático

Railway faz deploy automático a cada push para `main`:

```bash
# Fazer mudanças
git add .
git commit -m "Update feature"

# Push para GitHub
git push origin main

# Railway fará deploy automaticamente
```

## 🆘 Troubleshooting

### Erro: "Database connection failed"

1. Verificar `DATABASE_URL`
2. Verificar se o banco está rodando
3. Verificar firewall/security groups
4. Testar conexão localmente

### Erro: "CORS error"

1. Verificar `FRONTEND_URL` no backend
2. Verificar `VITE_API_URL` no frontend
3. Certifique-se de que ambas as URLs estão corretas

### Erro: "Token invalid"

1. Regenerar `JWT_SECRET`
2. Fazer logout e login novamente
3. Limpar localStorage do navegador

### Frontend mostra página em branco

1. Abrir DevTools (F12)
2. Verificar console para erros
3. Verificar se `VITE_API_URL` está correto
4. Verificar se o backend está acessível

## 📈 Próximos Passos

1. **Configurar domínio customizado**
   - Comprar domínio
   - Configurar DNS
   - Apontar para Railway

2. **Implementar CI/CD avançado**
   - Testes automáticos
   - Linting
   - Build checks

3. **Configurar backups**
   - Backup automático do banco
   - Plano de recuperação

4. **Monitoramento e alertas**
   - Configurar alertas de erro
   - Monitorar performance
   - Logs centralizados

## 📞 Suporte

- [Railway Docs](https://docs.railway.app)
- [Railway Community](https://railway.app/community)
- [GitHub Issues](https://github.com/seu-repo/issues)

---

**Parabéns! Seu projeto está no ar! 🎉**
