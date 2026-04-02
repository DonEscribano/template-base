import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
}

// ---------------------------------------------------------------------------
// In-memory fallback (dev / no Upstash configured)
// ---------------------------------------------------------------------------

interface MemoryEntry {
  count: number;
  resetAt: number;
}

function createMemoryLimiter(
  maxTokens: number,
  windowMs: number
): RateLimiter {
  const store = new Map<string, MemoryEntry>();

  // Periodic cleanup every 60 s to avoid unbounded memory growth
  const CLEANUP_INTERVAL = 60_000;
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      cleanup();

      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || entry.resetAt <= now) {
        const resetAt = now + windowMs;
        store.set(identifier, { count: 1, resetAt });
        return {
          success: true,
          limit: maxTokens,
          remaining: maxTokens - 1,
          reset: resetAt,
        };
      }

      entry.count += 1;
      const success = entry.count <= maxTokens;
      return {
        success,
        limit: maxTokens,
        remaining: Math.max(0, maxTokens - entry.count),
        reset: entry.resetAt,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Upstash-backed limiter
// ---------------------------------------------------------------------------

function createUpstashLimiter(
  maxTokens: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1]
): RateLimiter {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(maxTokens, window),
    analytics: false,
    prefix: "@upstash/ratelimit",
  });

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const result = await ratelimit.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

type WindowDuration = Parameters<typeof Ratelimit.slidingWindow>[1];

const hasUpstash =
  typeof process.env.UPSTASH_REDIS_REST_URL === "string" &&
  process.env.UPSTASH_REDIS_REST_URL.length > 0 &&
  typeof process.env.UPSTASH_REDIS_REST_TOKEN === "string" &&
  process.env.UPSTASH_REDIS_REST_TOKEN.length > 0;

/**
 * Creates a rate limiter. Uses Upstash Redis when configured,
 * otherwise falls back to an in-memory Map with TTL cleanup.
 */
export function createRateLimiter(
  maxTokens: number,
  window: WindowDuration
): RateLimiter {
  if (hasUpstash) {
    return createUpstashLimiter(maxTokens, window);
  }

  // Parse duration string like "1 m", "60 s", "1 h" to milliseconds
  const match = window.match(/^(\d+)\s*(ms|s|m|h|d)$/);
  if (!match) {
    throw new Error(`Invalid window duration: ${window}`);
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  const windowMs = amount * multipliers[unit];
  return createMemoryLimiter(maxTokens, windowMs);
}

export type { RateLimitResult, RateLimiter };
