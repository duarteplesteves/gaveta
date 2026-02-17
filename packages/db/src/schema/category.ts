import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const category = pgTable(
  "categories",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    isDefault: boolean("is_default").default(false).notNull(),
    metadataSchema: jsonb("metadata_schema"),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [unique("categories_name_user_id_unique").on(t.name, t.userId)]
);
