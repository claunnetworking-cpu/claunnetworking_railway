import { RATE_LIMITS } from '../optimizations';

/**
 * Simple in-memory rate limiter
 * Para produção, considere usar Redis
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Limpa entradas expiradas do rate limiter
 */
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetTime < now) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}, 60000); // Limpar a cada minuto

/**
 * Middleware de rate limiting
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  return (key: string): boolean => {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
      // Nova janela de tempo
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count < maxRequests) {
      entry.count++;
      return true;
    }

    return false;
  };
}

/**
 * Rate limiters específicos
 */
export const rateLimiters = {
  // Limite geral por IP
  global: createRateLimiter(
    RATE_LIMITS.REQUESTS_PER_MINUTE,
    60000 // 1 minuto
  ),

  // Limite de criação de links
  createLink: createRateLimiter(
    RATE_LIMITS.LINKS_PER_HOUR,
    3600000 // 1 hora
  ),

  // Limite de criação de vagas
  createJob: createRateLimiter(
    RATE_LIMITS.JOBS_PER_HOUR,
    3600000 // 1 hora
  ),

  // Limite de criação de cursos
  createCourse: createRateLimiter(
    RATE_LIMITS.COURSES_PER_HOUR,
    3600000 // 1 hora
  ),

  // Limite de cliques em links
  clickLink: createRateLimiter(
    1000, // 1000 cliques por minuto (muito permissivo)
    60000 // 1 minuto
  ),
};

/**
 * Função helper para gerar chave de rate limit
 */
export function getRateLimitKey(
  type: 'ip' | 'user' | 'link',
  identifier: string
): string {
  return `${type}:${identifier}`;
}

/**
 * Verificar rate limit
 */
export function checkRateLimit(
  key: string,
  limiter: (key: string) => boolean
): { allowed: boolean; remaining: number } {
  const allowed = limiter(key);
  const entry = rateLimitStore.get(key);
  const remaining = entry ? Math.max(0, (entry.count - 1)) : 0;

  return { allowed, remaining };
}
