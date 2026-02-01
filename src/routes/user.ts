import { User } from "@/models/User.js";
import { type Context, Hono } from "hono";
import { rateLimit } from "@/middleware/rateLimit.js";

export const user = new Hono();

// Rate limit login to 5 attempts per minute
user.post(
  "/login",
  rateLimit({ max: 5, windowMs: 60000 }),
  async (c: Context) => {
    const body = await c.req.json();
    const password = body?.password;

    if (!password)
      return c.json({ ok: false, message: "Adgangskode påkrævet" }, 400);

    const users = await User.find({});
    for (const user of users) {
      try {
        if (await Bun.password.verify(password, user.password)) {
          user.token = crypto.randomUUID();

          await user.save();

          return c.json({ ok: true, token: user.token });
        }
      } catch (e) {
        // ignore and continue
      }
    }

    return c.json({ ok: false, message: "Forkert pinkode" }, 401);
  },
);
