import { Elysia, t } from "elysia";

import { betterAuth } from "../auth";
import { ItemModel } from "./model";
import {
  createItem,
  deleteItem,
  getItemById,
  listItems,
  updateItem,
} from "./service";

export const items = new Elysia({
  name: "items",
  prefix: "/items",
  tags: ["Items"],
})
  .use(betterAuth)
  .model(ItemModel)
  .prefix("model", "Item.")
  .get("/", async ({ query, user }) => await listItems(user.id, query), {
    auth: true,
    detail: { summary: "List items with optional filters" },
    query: "Item.ListQuery",
    response: {
      200: t.Array(ItemModel.response),
    },
  })
  .post("/", async ({ body, user }) => await createItem(body, user.id), {
    auth: true,
    body: "Item.Create",
    detail: { summary: "Create a new item" },
    response: {
      200: "Item.Response",
      404: t.String(),
      500: t.String(),
    },
  })
  .guard({
    params: "Item.Id",
  })
  .get(
    "/:id",
    async ({ params: { id }, user }) => await getItemById(id, user.id),
    {
      auth: true,
      detail: { summary: "Get a single item with all details" },
      response: {
        200: "Item.Response",
        404: t.String(),
      },
    }
  )
  .patch(
    "/:id",
    async ({ body, params: { id }, user }) =>
      await updateItem(id, body, user.id),
    {
      auth: true,
      body: "Item.Update",
      detail: { summary: "Update an item" },
      response: {
        200: "Item.Response",
        404: t.String(),
        500: t.String(),
      },
    }
  )
  .delete("/:id", ({ params: { id }, user }) => deleteItem(id, user.id), {
    auth: true,
    detail: { summary: "Delete an item and its tag associations" },
    response: {
      200: t.Object({ success: t.Boolean() }),
      404: t.String(),
    },
  });
