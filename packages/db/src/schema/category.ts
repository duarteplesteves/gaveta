import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const category = pgTable("categories", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  isDefault: boolean("is_default").default(false).notNull(),
  metadataSchema: jsonb("metadata_schema"),
  name: text("name").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
