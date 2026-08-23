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
const apiBaseUrl = process.env.BASE_URL || `http://localhost:${env.PORT || 8000}`;
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "BlockForm OpenAPI",
  version: "1.0.0",
  baseUrl: apiBaseUrl.concat("/api"),
});


  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:4000"],
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
