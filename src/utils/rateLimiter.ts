/**
 * Client-side rate limiter for VoucherX.
 *
 * Provides sliding-window rate limiting for authentication attempts,
 * API calls, and user actions to mitigate brute force attacks,
 * DDoS attempts, and API cost explosion.
 *
 * Usage:
 *   import { rateLimiter, RateLimitError } from '../utils/rateLimiter';
 *
 *   // Check before performing an action
 *   try {
 *     rateLimiter.checkLimit('auth');
 *     await signIn(email, password);
 *   } catch (err) {
 *     if (err instanceof RateLimitError) {
 *       showError(`Too many attempts. Try again in ${err.retryAfterSeconds}s`);
 *     }
 *   }
 */

export class RateLimitError extends Error {
  /** Seconds until the user can retry */
  public readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    const message = `Too many requests. Please try again in ${retryAfterSeconds} second${retryAfterSeconds !== 1 ? 's' : ''}.`;
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/** Pre-configured rate limit tiers */
const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Auth: 5 attempts per 60 seconds (strict to prevent brute force)
  auth: { maxRequests: 5, windowMs: 60_000 },

  // API reads: 30 requests per 60 seconds
  apiRead: { maxRequests: 30, windowMs: 60_000 },

  // API writes: 10 requests per 60 seconds
  apiWrite: { maxRequests: 10, windowMs: 60_000 },

  // Form submissions: 3 per 30 seconds
  formSubmit: { maxRequests: 3, windowMs: 30_000 },

  // General user actions (clicks, copies, etc.): 20 per 10 seconds
  userAction: { maxRequests: 20, windowMs: 10_000 },
};

class RateLimiter {
  /** Map of action key → array of timestamps */
  private attempts: Map<string, number[]> = new Map();

  /**
   * Check if the action is within rate limits.
   * @param action - The rate limit tier key (e.g., 'auth', 'apiRead', 'apiWrite', 'formSubmit', 'userAction')
   * @param key - Optional sub-key for per-resource limiting (e.g., email address for auth)
   * @throws {RateLimitError} if the rate limit is exceeded
   */
  checkLimit(action: string, key?: string): void {
    const config = RATE_LIMIT_CONFIGS[action];
    if (!config) {
      console.warn(`[RateLimiter] Unknown action: "${action}". Allowing request.`);
      return;
    }

    const bucketKey = key ? `${action}:${key}` : action;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing attempts and filter to current window
    const timestamps = (this.attempts.get(bucketKey) || []).filter(t => t > windowStart);

    if (timestamps.length >= config.maxRequests) {
      // Calculate retry-after from the oldest request in the window
      const oldestInWindow = timestamps[0];
      const retryAfterMs = oldestInWindow + config.windowMs - now;
      const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
      throw new RateLimitError(retryAfterSeconds);
    }

    // Record this attempt
    timestamps.push(now);
    this.attempts.set(bucketKey, timestamps);
  }

  /**
   * Get the number of remaining requests allowed for an action.
   * @param action - The rate limit tier key
   * @param key - Optional sub-key
   * @returns Number of remaining requests in the current window
   */
  getRemainingRequests(action: string, key?: string): number {
    const config = RATE_LIMIT_CONFIGS[action];
    if (!config) return Infinity;

    const bucketKey = key ? `${action}:${key}` : action;
    const windowStart = Date.now() - config.windowMs;
    const timestamps = (this.attempts.get(bucketKey) || []).filter(t => t > windowStart);

    return Math.max(0, config.maxRequests - timestamps.length);
  }

  /**
   * Reset rate limit state for a specific action (e.g., after successful auth).
   * @param action - The rate limit tier key
   * @param key - Optional sub-key
   */
  reset(action: string, key?: string): void {
    const bucketKey = key ? `${action}:${key}` : action;
    this.attempts.delete(bucketKey);
  }

  /**
   * Clear all rate limit state.
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

/** Singleton rate limiter instance */
export const rateLimiter = new RateLimiter();
