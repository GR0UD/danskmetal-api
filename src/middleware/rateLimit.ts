import { createMiddleware } from "hono/factory";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000); // Clean every minute

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  max?: number; // Max requests per window
  message?: string;
}

export const rateLimit = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 60000,
    max = 10,
    message = "For mange forsøg. Prøv igen senere.",
  } = options;

  return createMiddleware(async (c, next) => {
    const ip =
      c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].count++;
    }

    if (store[key].count > max) {
      return c.json({ ok: false, message }, 429);
    }

    await next();
  });
};
