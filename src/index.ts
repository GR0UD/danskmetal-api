import { Hono } from "hono";
import type { Context } from "hono";
import { connectDB } from "./db";
import { user } from "./routes/user";
import { session } from "./routes/session";
import { logger } from "hono/logger";

connectDB();

const app = new Hono().basePath("/api");

app.use(logger());

// Health check
app.get("/", (c: Context) => c.text("Sandwich API running 🍔"));

app.route("/", session); // /api/sessions/*
app.route("/user", user); // /api/user/login

export default {
  port: 3001,
  fetch: app.fetch,
};
