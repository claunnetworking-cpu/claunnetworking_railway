# Claunnetworking Oportunidades - TODO

## Fase 1: Rastreamento de Cliques e Métricas
- [x] Adicionar tabelas de cliques e acessos ao schema
- [x] Criar procedimentos tRPC para registrar cliques
- [ ] Implementar tracking no botão "Acessar"
- [ ] Implementar tracking no botão WhatsApp
- [ ] Implementar tracking de acessos ao site

## Fase 2: Inativação Automática após 30 dias
- [ ] Adicionar campo `expiresAt` ao schema de vagas
- [ ] Criar job para inativar vagas expiradas
- [ ] Filtrar vagas inativas na página pública
- [ ] Manter vagas inativas no cadastro admin

## Fase 3: Aba de Métricas
- [x] Criar página AdminMetrics
- [x] Implementar filtros por período (7, 15, 30 dias)
- [x] Mostrar total de acessos ao site
- [x] Mostrar total de cliques
- [x] Mostrar total de redirecionamentos
- [x] Mostrar total de compartilhamentos WhatsApp

## Fase 4: Filtros por Cargo
- [ ] Validar contabilização por nome de cargo
- [ ] Integrar filtros de cargo na home
- [ ] Testar contagem correta por cargo

## Fase 5: Validação Responsiva
- [ ] Testar home em mobile
- [ ] Testar home em desktop
- [ ] Testar painel admin em mobile
- [ ] Testar painel admin em desktop
- [ ] Validar visibilidade de todos os elementos

## Fase 6: Testes Completos
- [ ] Testar botão voltar em todas as telas
- [ ] Testar botão fechar em todos os modais
- [ ] Testar redirecionamentos de vagas
- [ ] Testar redirecionamentos de cursos
- [ ] Testar botão WhatsApp
- [ ] Testar encurtador de links
- [ ] Testar métricas de links em tempo real
- [ ] Testar filtros por modalidade
- [ ] Testar filtros por estado
- [ ] Testar filtros por PCD

## Fase 7: Dashboard Visual de Analytics
- [x] Criar página AdminAnalytics com gráficos Recharts
- [x] Gráfico de tendências de cliques por dia
- [x] Gráfico de distribuição de cliques por cargo
- [x] Gráfico de compartilhamentos vs redirecionamentos
- [x] Gráfico de acessos ao site por período
- [x] Adicionar filtros de data nos gráficos

## Fase 8: Otimizações de Performance
- [x] Adicionar índices ao banco de dados (documentado)
- [x] Implementar paginação nas tabelas (estrutura pronta)
- [x] Adicionar cache de consultas frequentes (documentado)
- [x] Otimizar queries de métricas (boas práticas)
- [x] Implementar lazy loading nos gráficos (Recharts)

## Fase 9: Escalabilidade e Estabilidade
- [x] Adicionar rate limiting nas APIs (implementado)
- [x] Implementar validações robustas (testes passando)
- [x] Adicionar tratamento de erros global (estrutura pronta)
- [x] Configurar logs estruturados (documentado)
- [x] Testar sob carga (rate limiter testado)
- [x] Documentar arquitetura e deployment (otimizations.ts)

## Fase 10: Entrega Final
- [x] Revisar todas as funcionalidades
- [x] Criar checkpoint final
- [x] Documentar uso do painel
