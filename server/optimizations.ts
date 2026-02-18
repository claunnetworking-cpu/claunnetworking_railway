/**
 * Database Optimization Strategies
 * 
 * Este arquivo contém as otimizações implementadas para garantir
 * escalabilidade e performance sob alta carga.
 */

/**
 * ÍNDICES RECOMENDADOS:
 * 
 * Para tabela 'jobs':
 * - CREATE INDEX idx_jobs_status ON jobs(status);
 * - CREATE INDEX idx_jobs_created ON jobs(createdAt);
 * - CREATE INDEX idx_jobs_expires ON jobs(expiresAt);
 * - CREATE INDEX idx_jobs_category ON jobs(category);
 * - CREATE INDEX idx_jobs_modality ON jobs(modality);
 * - CREATE INDEX idx_jobs_pcd ON jobs(pcd);
 * 
 * Para tabela 'courses':
 * - CREATE INDEX idx_courses_status ON courses(status);
 * - CREATE INDEX idx_courses_created ON courses(createdAt);
 * - CREATE INDEX idx_courses_modality ON courses(modality);
 * 
 * Para tabela 'click_metrics':
 * - CREATE INDEX idx_metrics_job_id ON click_metrics(jobId);
 * - CREATE INDEX idx_metrics_course_id ON click_metrics(courseId);
 * - CREATE INDEX idx_metrics_link_id ON click_metrics(linkId);
 * - CREATE INDEX idx_metrics_created ON click_metrics(createdAt);
 * - CREATE INDEX idx_metrics_type ON click_metrics(type);
 * 
 * Para tabela 'shortened_links':
 * - CREATE INDEX idx_links_slug ON shortened_links(slug);
 * - CREATE INDEX idx_links_created ON shortened_links(createdAt);
 * 
 * Para tabela 'site_visits':
 * - CREATE INDEX idx_visits_created ON site_visits(createdAt);
 */

/**
 * ESTRATÉGIAS DE CACHE
 */
export const CACHE_STRATEGIES = {
  // Cache de métricas por 5 minutos
  METRICS_CACHE_TTL: 5 * 60 * 1000,
  
  // Cache de vagas ativas por 10 minutos
  JOBS_CACHE_TTL: 10 * 60 * 1000,
  
  // Cache de cursos por 10 minutos
  COURSES_CACHE_TTL: 10 * 60 * 1000,
  
  // Cache de links encurtados por 24 horas
  LINKS_CACHE_TTL: 24 * 60 * 60 * 1000,
};

/**
 * PAGINAÇÃO
 */
export const PAGINATION = {
  // Tamanho padrão de página
  DEFAULT_PAGE_SIZE: 20,
  
  // Tamanho máximo de página
  MAX_PAGE_SIZE: 100,
  
  // Tamanho mínimo de página
  MIN_PAGE_SIZE: 5,
};

/**
 * RATE LIMITING
 */
export const RATE_LIMITS = {
  // Limite de requisições por IP por minuto
  REQUESTS_PER_MINUTE: 100,
  
  // Limite de requisições por usuário por minuto
  USER_REQUESTS_PER_MINUTE: 200,
  
  // Limite de criação de links por hora
  LINKS_PER_HOUR: 50,
  
  // Limite de criação de vagas por hora
  JOBS_PER_HOUR: 20,
  
  // Limite de criação de cursos por hora
  COURSES_PER_HOUR: 20,
};

/**
 * QUERY OPTIMIZATION TIPS
 * 
 * 1. Sempre usar SELECT com campos específicos, nunca SELECT *
 * 2. Usar LIMIT para paginação
 * 3. Usar índices nas colunas de filtro (status, createdAt, category)
 * 4. Evitar JOINs complexos, usar denormalização quando necessário
 * 5. Usar agregações no banco ao invés de na aplicação
 * 6. Implementar cache para consultas frequentes
 * 7. Usar connection pooling (já configurado via Drizzle)
 */

/**
 * EXEMPLO DE QUERY OTIMIZADA:
 * 
 * // ❌ Ruim - Sem índice, sem limite
 * SELECT * FROM jobs WHERE status = 'active';
 * 
 * // ✅ Bom - Com índice, com limite, campos específicos
 * SELECT id, title, company, city, state, modality, pcd, createdAt 
 * FROM jobs 
 * WHERE status = 'active' AND expiresAt > NOW()
 * ORDER BY createdAt DESC
 * LIMIT 20 OFFSET 0;
 */

/**
 * MONITORAMENTO DE PERFORMANCE
 */
export const MONITORING = {
  // Tempo máximo de resposta aceitável (ms)
  MAX_RESPONSE_TIME: 1000,
  
  // Tempo de alerta para queries lentas (ms)
  SLOW_QUERY_THRESHOLD: 500,
  
  // Número máximo de conexões simultâneas
  MAX_CONNECTIONS: 100,
  
  // Timeout de conexão (ms)
  CONNECTION_TIMEOUT: 10000,
};

/**
 * HEALTH CHECK
 */
export const HEALTH_CHECK = {
  // Intervalo de health check (ms)
  INTERVAL: 30000,
  
  // Timeout do health check (ms)
  TIMEOUT: 5000,
};
