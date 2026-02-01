import { Hono, type Context } from "hono";
import { SandwichOrder } from "@/models/SandwichOrder.js";
import { sandwichOrderSchema } from "@/schemas/sandwich.js";

export const sandwich = new Hono();

sandwich.post("/sandwich-list", async (c: Context) => {
  const body = await c.req.json();

  const parsed = sandwichOrderSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const order = await SandwichOrder.create(parsed.data);
  return c.json({ ok: true, order });
});

// List sandwich orders
sandwich.get("/sandwich-list", async (c: Context) => {
  const orders = await SandwichOrder.find().sort({ createdAt: -1 }).lean();

  return c.json({ ok: true, orders });
});
