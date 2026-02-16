import { t } from "elysia";

const TagResponse = t.Object({
  createdAt: t.Date(),
  id: t.String({ format: "uuid" }),
  name: t.String(),
});

export const ItemModel = {
  create: t.Object({
    categoryId: t.String({ format: "uuid" }),
    metadata: t.Optional(t.Any()),
    notes: t.Optional(t.String()),
    tags: t.Array(t.String(), { default: [] }),
    title: t.Optional(t.String()),
    url: t.Optional(t.String({ format: "uri" })),
  }),
  id: t.Object({
    id: t.String({ format: "uuid" }),
  }),
  listQuery: t.Object({
    categoryId: t.Optional(t.String({ format: "uuid" })),
    cursor: t.Optional(t.String()),
    search: t.Optional(t.String()),
    tags: t.Optional(t.String()),
  }),
  response: t.Object({
    categoryId: t.String({ format: "uuid" }),
    createdAt: t.Date(),
    description: t.Nullable(t.String()),
    id: t.String({ format: "uuid" }),
    imageUrl: t.Nullable(t.String()),
    metadata: t.Nullable(t.Any()),
    notes: t.Nullable(t.String()),
    tags: t.Array(TagResponse),
    title: t.Nullable(t.String()),
    updatedAt: t.Date(),
    url: t.Nullable(t.String()),
  }),
  update: t.Object({
    categoryId: t.Optional(t.String({ format: "uuid" })),
    description: t.Optional(t.Nullable(t.String())),
    imageUrl: t.Optional(t.Nullable(t.String())),
    metadata: t.Optional(t.Any()),
    notes: t.Optional(t.Nullable(t.String())),
    tags: t.Optional(t.Array(t.String())),
    title: t.Optional(t.Nullable(t.String())),
    url: t.Optional(t.Nullable(t.String())),
  }),
};

export type CreateItem = typeof ItemModel.create.static;
export type UpdateItem = typeof ItemModel.update.static;
export type ItemResponse = typeof ItemModel.response.static;
export type ListItemQuery = typeof ItemModel.listQuery.static;
