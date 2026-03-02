#!/usr/bin/env bash
# =============================================================================
# setup-github.sh — Inicializa o repositório Git e faz o primeiro push
# Uso: bash setup-github.sh https://github.com/seu-usuario/seu-repo.git
# =============================================================================

set -e

REPO_URL="$1"

# ─── Cores ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERR]${NC}  $1"; exit 1; }

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ClaunNetworking v5.3.0 — GitHub Setup  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ─── Verificações ─────────────────────────────────────────────────────────────
command -v git >/dev/null 2>&1 || error "Git não encontrado. Instale em https://git-scm.com"

if [ -z "$REPO_URL" ]; then
  echo -e "${YELLOW}Uso: bash setup-github.sh <URL_DO_REPOSITORIO>${NC}"
  echo ""
  echo "  Exemplo (HTTPS): bash setup-github.sh https://github.com/seu-user/claun.git"
  echo "  Exemplo (SSH):   bash setup-github.sh git@github.com:seu-user/claun.git"
  echo ""
  read -p "Cole a URL do repositório: " REPO_URL
  [ -z "$REPO_URL" ] && error "URL não informada."
fi

# ─── Verificar se já existe .git ──────────────────────────────────────────────
if [ -d ".git" ]; then
  warn "Repositório Git já inicializado."
  REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
  if [ -n "$REMOTE" ]; then
    warn "Remote 'origin' já configurado: $REMOTE"
    read -p "Deseja sobrescrever? (s/N): " CONFIRM
    [[ "$CONFIRM" =~ ^[sS]$ ]] || { info "Abortado."; exit 0; }
    git remote set-url origin "$REPO_URL"
    success "Remote atualizado para: $REPO_URL"
  else
    git remote add origin "$REPO_URL"
    success "Remote adicionado: $REPO_URL"
  fi
else
  info "Inicializando repositório Git..."
  git init
  git remote add origin "$REPO_URL"
  success "Repositório inicializado."
fi

# ─── Garantir .env não vá para o repositório ──────────────────────────────────
if [ -f ".env" ]; then
  if git check-ignore -q .env; then
    success ".env está no .gitignore ✓"
  else
    warn ".env NÃO está no .gitignore! Adicionando..."
    echo ".env" >> .gitignore
  fi
fi

# ─── Primeiro commit ──────────────────────────────────────────────────────────
info "Preparando commit inicial..."
git add .

# Verificar se há algo para commitar
if git diff --cached --quiet; then
  warn "Nada para commitar. Repositório já está atualizado."
else
  git commit -m "feat: ClaunNetworking v5.3.0 — fullstack com JWT, migrations e Docker"
  success "Commit criado."
fi

# ─── Push ─────────────────────────────────────────────────────────────────────
info "Fazendo push para $REPO_URL..."
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
[ -z "$BRANCH" ] && { git checkout -b main; BRANCH="main"; }

git push -u origin "$BRANCH" && \
  success "Push concluído! Branch: $BRANCH" || \
  error "Falha no push. Verifique suas credenciais GitHub."

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  Projeto publicado no GitHub com sucesso!              ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║  Próximos passos para Railway:                            ║${NC}"
echo -e "${GREEN}║    1. railway login                                       ║${NC}"
echo -e "${GREEN}║    2. bash deploy-railway.sh                              ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
