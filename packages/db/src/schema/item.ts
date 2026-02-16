import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { category } from "./category";
import { user } from "./user";

export const item = pgTable("items", {
  categoryId: uuid("category_id")
    .notNull()
    .references(() => category.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description"),
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata"),
  notes: text("notes"),
  title: text("title"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  url: text("url"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
