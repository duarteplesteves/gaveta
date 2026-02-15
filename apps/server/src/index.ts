import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { env } from "@gaveta/env/server";
import { Elysia } from "elysia";
import { z } from "zod";

import { betterAuth as auth } from "./modules/auth";
import { OpenAPI } from "./plugins/openapi";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        tags: [
          { description: "General endpoints", name: "App" },
          { description: "Categories endpoints", name: "Categories" },
          { description: "Items endpoints", name: "Items" },
          { description: "Tags endpoints", name: "Tags" },
        ],
      },
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      references: fromTypes(
        process.env.NODE_ENV === "production"
          ? "dist/index.d.ts"
          : "src/index.ts"
      ),
    })
  )
  .use(
    cors({
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      origin: env.CORS_ORIGIN,
    })
  )
  .use(auth)
  .get("/", () => "OK")
  .listen(Bun.env.PORT ?? 3000, () =>
    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    )
  );

export type app = typeof app;
