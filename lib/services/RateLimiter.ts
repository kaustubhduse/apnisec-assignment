type RateLimitRecord = { count: number; resetTime: number };

export default class RateLimiter {
  private static requests: Map<string, RateLimitRecord> = new Map();
  private static LIMIT = 100;
  private static WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  static check(ip: string) {
    const now = Date.now();
    const record = this.requests.get(ip);

    if (!record) {
      this.requests.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      return { remaining: this.LIMIT - 1, resetTime: now + this.WINDOW_MS };
    }

    if (now > record.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      return { remaining: this.LIMIT - 1, resetTime: now + this.WINDOW_MS };
    }

    if (record.count < this.LIMIT) {
      record.count++;
      this.requests.set(ip, record);
      return { remaining: this.LIMIT - record.count, resetTime: record.resetTime };
    }

    throw { status: 429, message: 'Too many requests, please try again later.' };
  }
}
