import { Hono, type Context } from "hono";
import { MenuSession } from "@/models/MenuSession.js";
import { requireAuth } from "@/middleware/auth.js";
import { z } from "zod";

export const session = new Hono();

// Create a new menu session (requires auth - admin only)
session.post("/sessions", requireAuth, async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ ok: false, message: "Bruger ikke fundet" }, 401);
    }

    const newSession = await MenuSession.create({
      createdBy: user._id,
    });

    return c.json({
      ok: true,
      session: {
        _id: newSession._id,
        code: newSession.code,
        status: newSession.status,
        createdAt: newSession.createdAt,
        orders: newSession.orders,
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return c.json({ ok: false, message: "Kunne ikke oprette session" }, 500);
  }
});

// Get all sessions (requires auth - admin only)
session.get("/sessions", requireAuth, async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ ok: false, message: "Bruger ikke fundet" }, 401);
    }

    const sessions = await MenuSession.find({ createdBy: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return c.json({ ok: true, sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ ok: false, message: "Kunne ikke hente sessioner" }, 500);
  }
});

// Validate session code format (alphanumeric, 6-10 chars)
const isValidSessionCode = (code: string): boolean => {
  return /^[A-Za-z0-9]{6,10}$/.test(code);
};

// Get a specific session by code (public - for menu page)
session.get("/sessions/:code", async (c: Context) => {
  try {
    const code = c.req.param("code");

    if (!isValidSessionCode(code)) {
      return c.json({ ok: false, message: "Ugyldig sessionskode" }, 400);
    }

    const session = await MenuSession.findOne({
      code,
      status: "active",
    }).lean();

    if (!session) {
      return c.json(
        { ok: false, message: "Session ikke fundet eller udløbet" },
        404,
      );
    }

    return c.json({
      ok: true,
      session: {
        id: session._id,
        code: session.code,
        status: session.status,
        createdAt: session.createdAt,
        ordersCount: session.orders.length,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return c.json({ ok: false, message: "Kunne ikke hente session" }, 500);
  }
});

// Add an order to a session (public - for menu page)
const orderSchema = z.object({
  sandwich: z.string().min(1),
  bread: z.string().optional(),
  dressing: z.string().optional(),
  customer: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
});

session.post("/sessions/:code/orders", async (c: Context) => {
  try {
    const code = c.req.param("code");
    const body = await c.req.json();

    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ ok: false, errors: parsed.error.flatten() }, 400);
    }

    const menuSession = await MenuSession.findOne({ code, status: "active" });

    if (!menuSession) {
      return c.json(
        { ok: false, message: "Session ikke fundet eller udløbet" },
        404,
      );
    }

    menuSession.orders.push({
      ...parsed.data,
      createdAt: new Date(),
    });

    await menuSession.save();

    return c.json({
      ok: true,
      message: "Ordre tilføjet",
      ordersCount: menuSession.orders.length,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    return c.json({ ok: false, message: "Kunne ikke tilføje ordre" }, 500);
  }
});

// Close a session (requires auth - admin only)
session.patch("/sessions/:code/close", requireAuth, async (c: Context) => {
  try {
    const code = c.req.param("code");
    const user = c.get("user");

    const menuSession = await MenuSession.findOne({
      code,
      createdBy: user._id,
    });

    if (!menuSession) {
      return c.json({ ok: false, message: "Session ikke fundet" }, 404);
    }

    menuSession.status = "closed";
    await menuSession.save();

    return c.json({ ok: true, message: "Session lukket" });
  } catch (error) {
    console.error("Error closing session:", error);
    return c.json({ ok: false, message: "Kunne ikke lukke session" }, 500);
  }
});

// Delete an order from a session (requires auth - admin only)
session.delete(
  "/sessions/:code/orders/:orderId",
  requireAuth,
  async (c: Context) => {
    try {
      const code = c.req.param("code");
      const orderId = c.req.param("orderId");
      const user = c.get("user");

      const menuSession = await MenuSession.findOne({
        code,
        createdBy: user._id,
      });

      if (!menuSession) {
        return c.json({ ok: false, message: "Session ikke fundet" }, 404);
      }

      const orderIndex = menuSession.orders.findIndex(
        (order: any) => order._id.toString() === orderId,
      );

      if (orderIndex === -1) {
        return c.json({ ok: false, message: "Ordre ikke fundet" }, 404);
      }

      menuSession.orders.splice(orderIndex, 1);
      await menuSession.save();

      return c.json({ ok: true, message: "Ordre slettet" });
    } catch (error) {
      console.error("Error deleting order:", error);
      return c.json({ ok: false, message: "Kunne ikke slette ordre" }, 500);
    }
  },
);

// Delete a session (requires auth - admin only)
session.delete("/sessions/:code", requireAuth, async (c: Context) => {
  try {
    const code = c.req.param("code");
    const user = c.get("user");

    const result = await MenuSession.deleteOne({
      code,
      createdBy: user._id,
    });

    if (result.deletedCount === 0) {
      return c.json({ ok: false, message: "Session ikke fundet" }, 404);
    }

    return c.json({ ok: true, message: "Session slettet" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return c.json({ ok: false, message: "Kunne ikke slette session" }, 500);
  }
});
