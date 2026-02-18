# 🚀 Guia de Deployment - Claunnetworking Oportunidades no Railway

## Pré-requisitos

- Conta no [Railway.app](https://railway.app)
- Git instalado localmente
- Node.js 18+ instalado localmente (opcional, para testes)

---

## 1️⃣ Preparar o Repositório GitHub

### 1.1 Criar Repositório no GitHub

```bash
# Clone o projeto localmente (se ainda não tiver)
git clone https://github.com/SEU_USUARIO/claunnetworking-oportunidades.git
cd claunnetworking-oportunidades

# Inicializar Git (se necessário)
git init
git add .
git commit -m "Initial commit: Claunnetworking Oportunidades"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/claunnetworking-oportunidades.git
git push -u origin main
```

---

## 2️⃣ Configurar Railway

### 2.1 Login no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "Start a New Project"
3. Selecione "Deploy from GitHub"
4. Autorize o Railway a acessar seus repositórios GitHub
5. Selecione o repositório `claunnetworking-oportunidades`

### 2.2 Configurar Variáveis de Ambiente

No painel do Railway, vá para **Variables** e adicione:

```
# Banco de Dados (Railway fornecerá automaticamente)
DATABASE_URL=mysql://user:password@host:port/dbname

# Autenticação
JWT_SECRET=sua_chave_secreta_aleatoria_aqui
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im

# OAuth
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=seu_nome

# APIs Manus
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api_manus
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id

# App Config
VITE_APP_TITLE=Claunnetworking Oportunidades
VITE_APP_LOGO=https://seu-logo-url.png

# Node Environment
NODE_ENV=production
```

### 2.3 Adicionar Banco de Dados MySQL

1. No painel do Railway, clique em **+ Add Service**
2. Selecione **MySQL**
3. Railway criará automaticamente um banco de dados
4. A variável `DATABASE_URL` será preenchida automaticamente

---

## 3️⃣ Configurar Build e Deploy

### 3.1 Verificar Procfile (já incluído no projeto)

O arquivo `Procfile` já está configurado:

```
web: node dist/index.js
```

### 3.2 Verificar package.json

Certifique-se de que o `package.json` possui:

```json
{
  "scripts": {
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "node dist/index.js"
  }
}
```

### 3.3 Deploy Automático

Railway fará deploy automaticamente quando você fazer push para a branch `main`:

```bash
git add .
git commit -m "Update: feature xyz"
git push origin main
```

---

## 4️⃣ Verificar Deploy

### 4.1 Acompanhar Build

1. No painel do Railway, vá para **Deployments**
2. Clique no deploy mais recente
3. Veja os logs em tempo real

### 4.2 Acessar Aplicação

Após o build completar:

1. Vá para **Settings** → **Domains**
2. Copie o domínio gerado (ex: `claunnetworking-oportunidades.up.railway.app`)
3. Acesse em seu navegador

### 4.3 Verificar Saúde da Aplicação

```bash
# Testar endpoint de health check
curl https://seu-dominio.up.railway.app/api/health

# Testar autenticação
curl https://seu-dominio.up.railway.app/api/oauth/callback
```

---

## 5️⃣ Configurar Domínio Customizado (Opcional)

### 5.1 Adicionar Domínio Customizado

1. No Railway, vá para **Settings** → **Domains**
2. Clique em **+ Add Domain**
3. Digite seu domínio customizado (ex: `oportunidades.claunnetworking.com`)
4. Railway fornecerá um CNAME para configurar no seu registrador de domínio

### 5.2 Configurar DNS

1. Acesse seu registrador de domínio (GoDaddy, Namecheap, etc.)
2. Adicione um registro CNAME apontando para o CNAME fornecido pelo Railway
3. Aguarde propagação DNS (até 24 horas)

---

## 6️⃣ Monitoramento e Logs

### 6.1 Acessar Logs

1. No painel do Railway, vá para **Logs**
2. Veja logs em tempo real da aplicação
3. Procure por erros ou warnings

### 6.2 Métricas

1. Vá para **Metrics**
2. Monitore CPU, memória e requisições
3. Configure alertas se necessário

---

## 7️⃣ Troubleshooting

### Erro: "Build failed"

**Solução:**
- Verifique se todas as dependências estão no `package.json`
- Confirme que `npm install` funciona localmente
- Verifique logs do build no Railway

### Erro: "Database connection failed"

**Solução:**
- Confirme que `DATABASE_URL` está configurada
- Verifique se MySQL está rodando no Railway
- Teste a conexão localmente com a mesma URL

### Erro: "OAuth callback failed"

**Solução:**
- Confirme que `VITE_OAUTH_PORTAL_URL` está correto
- Verifique se `VITE_APP_ID` é válido
- Adicione seu domínio Railway à lista de redirect URIs no Manus

### Erro: "Cannot find module"

**Solução:**
- Verifique se todos os imports estão corretos
- Confirme que `esbuild` está bundlando corretamente
- Limpe `node_modules` e reinstale: `npm ci`

---

## 8️⃣ Backup e Recuperação

### 8.1 Backup do Banco de Dados

```bash
# Exportar dados MySQL
mysqldump -h host -u user -p database > backup.sql

# Importar dados
mysql -h host -u user -p database < backup.sql
```

### 8.2 Rollback de Deploy

1. No Railway, vá para **Deployments**
2. Selecione um deploy anterior
3. Clique em **Rollback**

---

## 9️⃣ Variáveis de Ambiente Seguras

### 9.1 Nunca commitar secrets

Adicione ao `.gitignore`:

```
.env
.env.local
.env.production.local
```

### 9.2 Usar Railway Secrets

1. No Railway, vá para **Variables**
2. Marque valores sensíveis como **Secret**
3. Railway não exibirá o valor em logs

---

## 🔟 Próximos Passos

- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar testes automatizados
- [ ] Configurar alertas de erro
- [ ] Implementar rate limiting
- [ ] Adicionar HTTPS automático (Railway faz isso)
- [ ] Configurar CDN para assets estáticos

---

## 📞 Suporte

- **Railway Docs:** https://docs.railway.app
- **Manus Docs:** https://docs.manus.im
- **GitHub Issues:** Abra uma issue no repositório

---

**Última atualização:** Fevereiro 2026
