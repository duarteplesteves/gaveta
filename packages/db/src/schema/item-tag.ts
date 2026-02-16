import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { item } from "./item";
import { tag } from "./tag";

export const itemTag = pgTable(
  "item_tags",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.itemId, t.tagId] })]
);
