import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { connectDB } from "./db";
import { sandwich } from "./routes/sandwich";
import { user } from "./routes/user";
import { session } from "./routes/session";
import { logger } from "hono/logger";

connectDB();

const app = new Hono().basePath("/api");

// Get allowed origins from env or use defaults for development
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

// Enable CORS for frontend
app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-API-Token"],
  }),
);

app.use(logger());

// Health check
app.get("/", (c: Context) => c.text("Sandwich API running 🍔"));

app.route("/", sandwich);
app.route("/", session); // /api/sessions/*
app.route("/user", user); // /api/user/login

export default app;
