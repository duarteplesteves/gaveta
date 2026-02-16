import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { user } from "./user";

export const tag = pgTable(
  "tags",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [unique("tags_name_user_id_unique").on(t.name, t.userId)]
);
