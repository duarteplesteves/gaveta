import { t } from "elysia";

export const CategoryModel = {
  create: t.Object({
    name: t.String({ maxLength: 100, minLength: 1 }),
  }),
  id: t.Object({
    id: t.String({ format: "uuid" }),
  }),
  response: t.Object({
    createdAt: t.Date(),
    id: t.String({ format: "uuid" }),
    isDefault: t.Boolean(),
    metadataSchema: t.Nullable(t.Any()),
    name: t.String(),
  }),
  update: t.Object({
    name: t.String({ maxLength: 100, minLength: 1 }),
  }),
};

export type CreateCategory = typeof CategoryModel.create.static;
export type UpdateCategory = typeof CategoryModel.update.static;
export type CategoryResponse = typeof CategoryModel.response.static;
