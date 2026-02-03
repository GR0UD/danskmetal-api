import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { connectDB } from "./db";
import { user } from "./routes/user";
import { session } from "./routes/session";
import { logger } from "hono/logger";

connectDB();

const app = new Hono().basePath("/api");

app.use(logger());

// CORS middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check
app.get("/", (c: Context) => c.text("Sandwich API running 🍔"));

app.route("/", session); // /api/sessions/*
app.route("/user", user); // /api/user/login

export default app;
