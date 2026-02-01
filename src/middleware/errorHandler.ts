import type { Context } from "hono";

export const errorHandler = () => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (err) {
      console.error(err);
      return c.json({ ok: false, message: "Internal Server Error" }, 500);
    }
  };
};
