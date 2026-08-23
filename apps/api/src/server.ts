import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";
import { githubOAuthRouter } from "./routes/github-oauth";

import { env } from "./env";

export const app = express();

// Trust reverse proxy (e.g. Render, Vercel, Cloudflare) for HTTPS & cookies
app.set("trust proxy", 1);

const apiBaseUrl = process.env.BASE_URL || `http://localhost:${env.PORT || 8000}`;
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "BlockForm OpenAPI",
  version: "1.0.0",
  baseUrl: apiBaseUrl.concat("/api"),
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:8000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4000",
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        /^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // Default: allow valid incoming web origin with credentials
      return callback(null, true);
    },
    credentials: true,
  }),
);


app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "BlockForm API is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "BlockForm API server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${apiBaseUrl}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${apiBaseUrl}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

// GitHub OAuth — must be mounted BEFORE the OpenAPI catch-all
app.use('/api/auth', githubOAuthRouter);

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
