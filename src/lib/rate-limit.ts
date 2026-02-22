import { NextResponse } from "next/server";

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  maxTokens: number;
  refillRate: number; // tokens per interval
  refillInterval: number; // ms
}

const buckets = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const staleThreshold = now - 3_600_000; // 1 hour
  for (const [key, entry] of buckets) {
    if (entry.lastRefill < staleThreshold) {
      buckets.delete(key);
    }
  }
}

function consume(key: string, config: RateLimitConfig): boolean {
  cleanup();

  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry) {
    buckets.set(key, { tokens: config.maxTokens - 1, lastRefill: now });
    return true;
  }

  const elapsed = now - entry.lastRefill;
  const refills = Math.floor(elapsed / config.refillInterval);
  if (refills > 0) {
    entry.tokens = Math.min(config.maxTokens, entry.tokens + refills * config.refillRate);
    entry.lastRefill = now;
  }

  if (entry.tokens < 1) {
    return false;
  }

  entry.tokens -= 1;
  return true;
}

/**
 * Per-user rate limiting for expensive operations.
 * Uses token bucket algorithm with in-memory storage.
 *
 * For Vercel serverless, each instance has its own memory so this provides
 * per-instance protection. For stricter limits, upgrade to Upstash Redis.
 */
export function rateLimit(
  userId: string,
  action: string,
  config: RateLimitConfig
): NextResponse | null {
  const key = `${action}:${userId}`;
  const allowed = consume(key, config);

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  return null;
}

export const RATE_LIMITS = {
  headshot: {
    maxTokens: 5,       // 5 generations
    refillRate: 1,       // 1 token back
    refillInterval: 3_600_000, // per hour (so ~5/hour, refills slowly)
  },
} as const;
