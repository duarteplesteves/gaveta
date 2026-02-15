import { env } from "@gaveta/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import { relations } from "./relations";

export const db = drizzle(env.DATABASE_URL, {
  casing: "snake_case",
  relations,
});
