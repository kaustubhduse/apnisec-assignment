import { redis } from '../redis';

type RateLimitRecord = { count: number; resetTime: number };

export default class RateLimiter {
  private static LIMIT = 100;
  private static WINDOW_MS = 15 * 60 * 1000;

  static async check(ip: string) {
    const now = Date.now();
    const key = `ratelimit:${ip}`;
    
    // Get current record from Redis
    const recordData = await redis.get<RateLimitRecord>(key);
    
    if (!recordData) {
      // First request from this IP
      const record = { count: 1, resetTime: now + this.WINDOW_MS };
      await redis.set(key, record, { px: this.WINDOW_MS });
      return { remaining: this.LIMIT - 1, resetTime: now + this.WINDOW_MS };
    }

    // Check if window has expired
    if (now > recordData.resetTime) {
      const record = { count: 1, resetTime: now + this.WINDOW_MS };
      await redis.set(key, record, { px: this.WINDOW_MS });
      return { remaining: this.LIMIT - 1, resetTime: now + this.WINDOW_MS };
    }

    // Check if limit exceeded
    if (recordData.count < this.LIMIT) {
      recordData.count++;
      const ttl = recordData.resetTime - now;
      await redis.set(key, recordData, { px: ttl });
      return { remaining: this.LIMIT - recordData.count, resetTime: recordData.resetTime };
    }

    // Rate limit exceeded
    throw { status: 429, message: 'Too many requests, please try again later.' };
  }
}
