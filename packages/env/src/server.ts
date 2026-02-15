import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    BASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    CORS_ORIGIN: z
      .string()
      .transform((origins) => origins.split(" "))
      .refine((origins) => z.string().array().parse(origins)),
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
});
