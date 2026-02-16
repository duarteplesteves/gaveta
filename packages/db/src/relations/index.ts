import { defineRelations } from "drizzle-orm";

import * as schema from "../schema";

export const relations = defineRelations(schema, (r) => ({
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  category: {
    items: r.many.item(),
    user: r.one.user({
      from: r.category.userId,
      to: r.user.id,
    }),
  },
  item: {
    category: r.one.category({
      from: r.item.categoryId,
      to: r.category.id,
    }),
    itemTags: r.many.itemTag(),
    user: r.one.user({
      from: r.item.userId,
      to: r.user.id,
    }),
  },
  itemTag: {
    item: r.one.item({
      from: r.itemTag.itemId,
      to: r.item.id,
    }),
    tag: r.one.tag({
      from: r.itemTag.tagId,
      to: r.tag.id,
    }),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  tag: {
    itemTags: r.many.itemTag(),
    user: r.one.user({
      from: r.tag.userId,
      to: r.user.id,
    }),
  },
  user: {
    accounts: r.many.account(),
    categories: r.many.category(),
    items: r.many.item(),
    sessions: r.many.session(),
    tags: r.many.tag(),
  },
}));
