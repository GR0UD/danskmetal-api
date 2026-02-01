import { User } from "@/models/User.js";
import { type Context, Hono } from "hono";

export const user = new Hono();

user.post("/login", async (c: Context) => {
  const body = await c.req.json();
  const password = body?.password;

  if (!password)
    return c.json({ ok: false, message: "Password required" }, 400);

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

  return c.json({ ok: false, message: "Invalid password" }, 401);
});
