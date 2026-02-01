import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { connectDB } from "./db";
import { user } from "./routes/user";
import { session } from "./routes/session";
import { logger } from "hono/logger";

connectDB();

const app = new Hono().basePath("/api");

// Get allowed origins from env or use defaults for development
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://172.20.10.8:3000",
      "http://172.20.10.8:3002",
    ];

// Enable CORS for frontend
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return allowedOrigins[0];
      // In development, allow all origins
      if (process.env.NODE_ENV !== "production") return origin;
      // In production, check against allowed list
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-API-Token"],
  }),
);

app.use(logger());

// Health check
app.get("/", (c: Context) => c.text("Sandwich API running 🍔"));

app.route("/", session); // /api/sessions/*
app.route("/user", user); // /api/user/login

export default {
  port: 3001,
  fetch: app.fetch,
};
