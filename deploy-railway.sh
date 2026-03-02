#!/usr/bin/env bash
# =============================================================================
# deploy-railway.sh — Deploy completo no Railway (backend + frontend + banco)
# Pré-requisito: railway CLI instalada e autenticada (railway login)
# Docs Railway CLI: https://docs.railway.app/develop/cli
# =============================================================================

set -e

# ─── Cores ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERR]${NC}  $1"; exit 1; }
step()    { echo -e "\n${CYAN}══ $1 ══${NC}"; }

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ClaunNetworking v5.3.0 — Deploy Railway    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ─── Verificações ─────────────────────────────────────────────────────────────
command -v railway >/dev/null 2>&1 || {
  error "Railway CLI não encontrada. Instale com:
  npm install -g @railway/cli
  Depois faça: railway login"
}

railway whoami >/dev/null 2>&1 || error "Você não está autenticado. Execute: railway login"

RAILWAY_USER=$(railway whoami 2>/dev/null)
success "Autenticado como: $RAILWAY_USER"

# ─── Carregar variáveis do .env ───────────────────────────────────────────────
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
  info "Variáveis carregadas do .env"
else
  warn ".env não encontrado. Usando valores padrão."
fi

JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-$(openssl rand -hex 16)}"
POSTGRES_DB="${POSTGRES_DB:-claunnetworking}"

# ─── Criar projeto Railway ─────────────────────────────────────────────────────
step "Configurando projeto Railway"
PROJECT_NAME="claunnetworking-$(date +%s | tail -c 5)"
info "Nome do projeto: $PROJECT_NAME"

railway init --name "$PROJECT_NAME" 2>/dev/null || warn "Projeto já existe ou usando projeto atual."

# ─── Serviço PostgreSQL ────────────────────────────────────────────────────────
step "Provisionando PostgreSQL"
railway add --plugin postgresql 2>/dev/null && success "PostgreSQL adicionado." || warn "PostgreSQL já existe."

# Aguardar banco ficar disponível
info "Aguardando PostgreSQL ficar disponível..."
sleep 5

DB_URL=$(railway variables --service postgresql 2>/dev/null | grep DATABASE_URL | awk '{print $2}' || echo "")
if [ -n "$DB_URL" ]; then
  success "DATABASE_URL obtida do Railway"
else
  warn "Não foi possível obter DATABASE_URL automaticamente."
  warn "Após o deploy, configure manualmente nas variáveis do serviço backend."
  DB_URL='${{Postgres.DATABASE_URL}}'
fi

# ─── Deploy Backend ────────────────────────────────────────────────────────────
step "Deploy do Backend"

info "Configurando variáveis do backend..."
railway service create backend 2>/dev/null || warn "Serviço backend já existe."
railway service backend

railway variables set \
  NODE_ENV=production \
  JWT_SECRET="$JWT_SECRET" \
  LOG_LEVEL=info \
  CORS_ORIGIN="PLACEHOLDER_FRONTEND_URL" \
  RATE_LIMIT_MAX=300 \
  RATE_LIMIT_WINDOW_MS=60000 \
  2>/dev/null && success "Variáveis do backend configuradas." || warn "Algumas variáveis podem não ter sido definidas."

info "Fazendo deploy do backend (Root Directory: backend)..."
railway up --service backend --detach 2>/dev/null || {
  warn "Não foi possível fazer deploy automático."
  info "Configure manualmente no Railway:"
  info "  Settings → Root Directory → backend"
}

# Aguardar deploy
info "Aguardando deploy do backend..."
sleep 10

BACKEND_URL=$(railway domain --service backend 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1 || echo "")
if [ -n "$BACKEND_URL" ]; then
  success "Backend disponível em: $BACKEND_URL"
else
  warn "URL do backend não detectada automaticamente."
  read -p "Cole a URL do backend Railway: " BACKEND_URL
fi

# ─── Deploy Frontend ───────────────────────────────────────────────────────────
step "Deploy do Frontend"

info "Configurando variáveis do frontend..."
railway service create frontend 2>/dev/null || warn "Serviço frontend já existe."
railway service frontend

railway variables set \
  VITE_API_URL="$BACKEND_URL" \
  VITE_DEFAULT_TENANT_ID="00000000-0000-0000-0000-000000000001" \
  2>/dev/null && success "Variáveis do frontend configuradas."

info "Fazendo deploy do frontend (Root Directory: frontend)..."
railway up --service frontend --detach 2>/dev/null || {
  warn "Configure manualmente: Settings → Root Directory → frontend"
}

sleep 10

FRONTEND_URL=$(railway domain --service frontend 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1 || echo "")
if [ -n "$FRONTEND_URL" ]; then
  success "Frontend disponível em: $FRONTEND_URL"

  # Atualizar CORS do backend com URL real do frontend
  if [ -n "$BACKEND_URL" ]; then
    railway service backend
    railway variables set CORS_ORIGIN="$FRONTEND_URL" 2>/dev/null && \
      success "CORS do backend atualizado para: $FRONTEND_URL"
  fi
fi

# ─── Sumário ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  Deploy Railway concluído!                                 ║${NC}"
echo -e "${GREEN}║                                                               ║${NC}"
printf  "${GREEN}║  🌐 Frontend: %-49s║${NC}\n" "${FRONTEND_URL:-Verifique no painel Railway}"
printf  "${GREEN}║  🔧 Backend:  %-49s║${NC}\n" "${BACKEND_URL:-Verifique no painel Railway}"
echo -e "${GREEN}║                                                               ║${NC}"
echo -e "${GREEN}║  📋 Credenciais de demo:                                      ║${NC}"
echo -e "${GREEN}║     Email: admin@claunnetworking.com                          ║${NC}"
echo -e "${GREEN}║     Senha: Admin@1234                                         ║${NC}"
echo -e "${GREEN}║  ⚠️  Troque a senha após o primeiro acesso!                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}💡 JWT_SECRET gerado neste deploy:${NC}"
echo -e "   $JWT_SECRET"
echo -e "${YELLOW}   Salve em local seguro caso precise reconfigurar.${NC}"
echo ""
