import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

/* oxlint-disable jest/require-hook */
dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  dialect: "postgresql",
  out: "./src/migrations",
  schema: "./src/schema",
});
