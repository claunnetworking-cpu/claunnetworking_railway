import { describe, it, expect } from 'vitest';
import { 
  createRateLimiter, 
  getRateLimitKey, 
  checkRateLimit,
  rateLimiters 
} from './middleware/rateLimiter';

describe('Rate Limiter', () => {
  it('deve permitir requisições dentro do limite', () => {
    const limiter = createRateLimiter(5, 60000);
    const key = 'test-ip:192.168.1.1-' + Date.now();

    for (let i = 0; i < 5; i++) {
      const result = limiter(key);
      expect(result).toBe(true);
    }
  });

  it('deve bloquear requisições acima do limite', () => {
    const limiter = createRateLimiter(3, 60000);
    const key = 'test-ip:192.168.1.2-' + Date.now();

    // Fazer 3 requisições (permitidas)
    for (let i = 0; i < 3; i++) {
      const result = limiter(key);
      expect(result).toBe(true);
    }

    // 4ª requisição deve ser bloqueada
    const result = limiter(key);
    expect(result).toBe(false);
  });

  it('deve gerar chave de rate limit corretamente', () => {
    const key1 = getRateLimitKey('ip', '192.168.1.1');
    expect(key1).toBe('ip:192.168.1.1');

    const key2 = getRateLimitKey('user', 'user123');
    expect(key2).toBe('user:user123');

    const key3 = getRateLimitKey('link', 'link-abc123');
    expect(key3).toBe('link:link-abc123');
  });

  it('deve permitir diferentes IPs com limites independentes', () => {
    const limiter = createRateLimiter(2, 60000);
    const key1 = 'test-ip:192.168.1.1-' + Date.now();
    const key2 = 'test-ip:192.168.1.2-' + Date.now();

    // IP 1: 2 requisições (limite atingido)
    limiter(key1);
    limiter(key1);
    expect(limiter(key1)).toBe(false);

    // IP 2: deve permitir (limite independente)
    expect(limiter(key2)).toBe(true);
    expect(limiter(key2)).toBe(true);
    expect(limiter(key2)).toBe(false);
  });

  it('deve retornar informações corretas de rate limit', () => {
    const limiter = createRateLimiter(3, 60000);
    const key = 'test-ip:192.168.1.3-' + Date.now();

    // 1ª requisição
    limiter(key);
    let result = checkRateLimit(key, limiter);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('limiter global deve funcionar corretamente', () => {
    const key = 'test-ip:192.168.1.4-' + Date.now();
    
    // Fazer várias requisições
    for (let i = 0; i < 100; i++) {
      rateLimiters.global(key);
    }

    // 101ª requisição deve ser bloqueada
    const result = rateLimiters.global(key);
    expect(result).toBe(false);
  });

  it('limiter de criação de links deve funcionar corretamente', () => {
    const key = getRateLimitKey('user', 'user123-' + Date.now());
    
    // Fazer 50 requisições (limite)
    for (let i = 0; i < 50; i++) {
      rateLimiters.createLink(key);
    }

    // 51ª requisição deve ser bloqueada
    const result = rateLimiters.createLink(key);
    expect(result).toBe(false);
  });
});
