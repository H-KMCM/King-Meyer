// Strict sliding-window rate limiting for authentication endpoints

interface RateLimitRecord {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const DEFAULT_AUTH_LIMITS: RateLimitConfig = {
  maxAttempts: 5,           // 5 attempts
  windowMs: 60 * 1000,      // per 1 minute
  blockDurationMs: 5 * 60 * 1000 // 5 minutes block on breach
};

export function checkRateLimit(
  ip: string, 
  config: RateLimitConfig = DEFAULT_AUTH_LIMITS
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record) {
    ipMap.set(ip, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return { allowed: true, remaining: config.maxAttempts - 1, retryAfterSeconds: 0 };
  }

  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
  }

  // If window expired, reset
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.windowMs;
    delete record.blockedUntil;
    return { allowed: true, remaining: config.maxAttempts - 1, retryAfterSeconds: 0 };
  }

  // Increment attempts within window
  record.count += 1;
  if (record.count > config.maxAttempts) {
    record.blockedUntil = now + config.blockDurationMs;
    const retryAfter = Math.ceil(config.blockDurationMs / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
  }

  return {
    allowed: true,
    remaining: Math.max(0, config.maxAttempts - record.count),
    retryAfterSeconds: 0
  };
}

export function resetRateLimit(ip: string): void {
  ipMap.delete(ip);
}
