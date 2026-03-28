/**
 * In-memory sliding-window rate limiter.
 * Key: client IP → { count: number, windowStart: number }
 * Resets after `windowMs` milliseconds.
 *
 * Returns { allowed, remaining, resetAt } where resetAt = unix seconds.
 */
const store = new Map<string, { count: number; windowStart: number }>();

const WINDOW_MS = 60_000;   // 1 minute
const MAX_REQUESTS = 60;
const WINDOW_SEC = Math.ceil(WINDOW_MS / 1000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // Fresh window
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, resetAt: Math.ceil(now / 1000) + WINDOW_SEC };
  }

  entry.count += 1;
  store.set(ip, entry);

  const remaining = MAX_REQUESTS - entry.count;
  const resetAt = Math.ceil(entry.windowStart / 1000) + WINDOW_SEC;

  return {
    allowed: entry.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, remaining),
    resetAt,
  };
}

/** Prune stale entries periodically to avoid memory leaks */
export function pruneRateStore(): void {
  const cutoff = Date.now() - WINDOW_MS * 2;
  for (const [ip, entry] of store.entries()) {
    if (entry.windowStart < cutoff) store.delete(ip);
  }
}

// Run prune every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(pruneRateStore, 5 * 60 * 1000);
}
