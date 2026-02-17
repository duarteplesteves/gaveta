import { Elysia, t } from "elysia";

import { betterAuth } from "../auth";
import { CategoryModel } from "./model";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "./service";

export const categories = new Elysia({
  name: "categories",
  prefix: "/categories",
  tags: ["Categories"],
})
  .use(betterAuth)
  .model(CategoryModel)
  .prefix("model", "Category.")
  .get("/", async ({ user }) => await listCategories(user.id), {
    auth: true,
    detail: { summary: "List all categories" },
    response: {
      200: t.Array(CategoryModel.response),
    },
  })
  .post(
    "/",
    async ({ body, user, set }) => {
      const res = await createCategory(body, user.id);
      set.status = 201;
      return res;
    },
    {
      auth: true,
      body: "Category.Create",
      detail: { summary: "Create a user-defined category" },
      response: {
        200: "Category.Response",
        500: t.String(),
      },
    }
  )
  .guard({
    params: "Category.Id",
  })
  .patch(
    "/:id",
    async ({ body, params: { id }, user }) =>
      await updateCategory(id, body, user.id),
    {
      auth: true,
      body: "Category.Update",
      detail: { summary: "Update a user-created category" },
      response: {
        200: "Category.Response",
        403: t.String(),
        404: t.String(),
        500: t.String(),
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, user }) => await deleteCategory(id, user.id),
    {
      auth: true,
      detail: { summary: "Delete a user-created category" },
      response: {
        200: t.Object({ success: t.Boolean() }),
        403: t.String(),
        404: t.String(),
      },
    }
  );
