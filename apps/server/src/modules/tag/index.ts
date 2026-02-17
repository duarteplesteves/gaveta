import { Elysia, t } from "elysia";

import { betterAuth } from "../auth";
import { TagModel } from "./model";
import { deleteTag, listTags } from "./service";

export const tags = new Elysia({
  name: "tags",
  prefix: "/tags",
  tags: ["Tags"],
})
  .use(betterAuth)
  .model(TagModel)
  .prefix("model", "Tag.")
  .get("/", ({ query, user }) => listTags(user.id, query.search), {
    auth: true,
    detail: { summary: "List tags (with optional search for autocomplete)" },
    query: "Tag.ListQuery",
    response: {
      200: t.Array(TagModel.response),
    },
  })
  .delete("/:id", ({ params: { id }, user }) => deleteTag(id, user.id), {
    auth: true,
    detail: { summary: "Delete a tag and remove associations" },
    params: "Tag.Id",
    response: {
      200: t.Object({ success: t.Boolean() }),
      404: t.String(),
    },
  });
