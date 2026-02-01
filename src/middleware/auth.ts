import { createMiddleware } from "hono/factory";
import { User } from "@/models/User";

export const requireAuth = createMiddleware(async (c, next) => {
  const auth = c.req.header("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : auth;

  if (!token) {
    return c.json({ ok: false, message: "Unauthorized" }, 401);
  }

  const user = await User.findOne({ token }).lean();
  if (!user) {
    return c.json({ ok: false, message: "Unauthorized" }, 401);
  }

  // Attach user to the context for downstream handlers
  c.set("user", user);

  await next();
});
