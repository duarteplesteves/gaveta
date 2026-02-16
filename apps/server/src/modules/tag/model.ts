import { t } from "elysia";

export const TagModel = {
  id: t.Object({
    id: t.String({ format: "uuid" }),
  }),
  listQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  response: t.Object({
    createdAt: t.Date(),
    id: t.String({ format: "uuid" }),
    name: t.String(),
  }),
};

export type TagResponse = typeof TagModel.response.static;
