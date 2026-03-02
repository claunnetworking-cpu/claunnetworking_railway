#!/usr/bin/env bash
# =============================================================================
# deploy-local.sh — Sobe o projeto localmente via Docker Compose
# Uso: bash deploy-local.sh [start|stop|restart|logs|status|reset]
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERR]${NC}  $1"; exit 1; }

CMD="${1:-start}"

# ─── Verificações ─────────────────────────────────────────────────────────────
command -v docker >/dev/null 2>&1         || error "Docker não encontrado: https://docs.docker.com/get-docker/"
docker compose version >/dev/null 2>&1   || error "Docker Compose não encontrado."

print_header() {
  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║   ClaunNetworking v5.3.0 — Deploy Local      ║${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
  echo ""
}

# ─── Garantir .env existe ─────────────────────────────────────────────────────
ensure_env() {
  if [ ! -f ".env" ]; then
    warn ".env não encontrado. Criando a partir do .env.example..."
    if [ -f ".env.example" ]; then
      cp .env.example .env
      # Gerar JWT_SECRET seguro automaticamente
      JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "changeme-$(date +%s)-please-update-this")
      sed -i.bak "s|troque-por-uma-chave-secreta-com-pelo-menos-32-chars|$JWT_SECRET|g" .env
      rm -f .env.bak
      success ".env criado com JWT_SECRET seguro gerado automaticamente."
      warn "Revise o .env antes de usar em produção!"
    else
      error ".env.example não encontrado. Crie o arquivo .env manualmente."
    fi
  fi
}

# ─── Comandos ─────────────────────────────────────────────────────────────────
case "$CMD" in

  start)
    print_header
    ensure_env
    info "Construindo e subindo todos os serviços..."
    docker compose up --build -d
    echo ""
    info "Aguardando serviços ficarem saudáveis..."
    sleep 8

    # Verificar health do backend
    ATTEMPTS=0
    until curl -sf http://localhost:3000/health >/dev/null 2>&1 || [ $ATTEMPTS -ge 15 ]; do
      sleep 2
      ATTEMPTS=$((ATTEMPTS + 1))
      echo -n "."
    done
    echo ""

    if curl -sf http://localhost:3000/health >/dev/null 2>&1; then
      success "Backend saudável ✓"
    else
      warn "Backend ainda não respondeu. Verifique: bash deploy-local.sh logs api"
    fi

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅  ClaunNetworking está no ar!                          ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║  🌐 Frontend:       http://localhost:5173                 ║${NC}"
    echo -e "${GREEN}║  🔧 API:            http://localhost:3000                 ║${NC}"
    echo -e "${GREEN}║  ❤️  Health:         http://localhost:3000/health          ║${NC}"
    echo -e "${GREEN}║  📊 Métricas:       http://localhost:3000/metrics         ║${NC}"
    echo -e "${GREEN}║  🐘 PostgreSQL:     localhost:5432                        ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║  📋 Login demo:                                           ║${NC}"
    echo -e "${GREEN}║     Email: admin@claunnetworking.com                      ║${NC}"
    echo -e "${GREEN}║     Senha: Admin@1234                                     ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    ;;

  stop)
    print_header
    info "Parando todos os serviços..."
    docker compose down
    success "Serviços parados."
    ;;

  restart)
    print_header
    info "Reiniciando todos os serviços..."
    docker compose down
    docker compose up --build -d
    success "Serviços reiniciados."
    ;;

  logs)
    SERVICE="${2:-}"
    if [ -n "$SERVICE" ]; then
      docker compose logs -f "$SERVICE"
    else
      docker compose logs -f
    fi
    ;;

  status)
    print_header
    docker compose ps
    echo ""
    info "Health check da API:"
    curl -s http://localhost:3000/health 2>/dev/null | python3 -m json.tool 2>/dev/null || \
      echo "  API não está respondendo."
    ;;

  reset)
    print_header
    warn "⚠️  Isso vai apagar TODOS os dados do banco de dados!"
    read -p "Tem certeza? Digite 'sim' para confirmar: " CONFIRM
    if [ "$CONFIRM" = "sim" ]; then
      docker compose down -v
      success "Serviços e volumes removidos. Execute 'bash deploy-local.sh start' para recriar."
    else
      info "Operação cancelada."
    fi
    ;;

  *)
    echo ""
    echo -e "${YELLOW}Uso: bash deploy-local.sh [comando]${NC}"
    echo ""
    echo "  Comandos disponíveis:"
    echo "    start              Sobe todos os serviços (padrão)"
    echo "    stop               Para todos os serviços"
    echo "    restart            Recria e reinicia tudo"
    echo "    logs [serviço]     Mostra logs (api | web | db)"
    echo "    status             Status dos serviços + health check"
    echo "    reset              Remove tudo incluindo dados do banco"
    echo ""
    ;;

esac
