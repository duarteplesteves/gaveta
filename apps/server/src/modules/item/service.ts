import { db } from "@gaveta/db";
import { eq } from "@gaveta/db/drizzle";
import { item, itemTag } from "@gaveta/db/schema";
import { status } from "elysia";

import { nonNullable } from "@/utils/misc";

import type { CreateItem, ListItemQuery, UpdateItem } from "./model";

import { upsertTags } from "../tag/service";
import { fetchOgMetadata } from "./og";

/** Shared `with` clause for loading tags on items via the join table. */
const withItemTags = {
  itemTags: {
    columns: {},
    with: {
      tag: {
        columns: { createdAt: true, id: true, name: true },
      },
    },
  },
} as const;

/** Flatten the nested itemTags → tag structure into a flat tags array. */
function flattenTags<
  T extends {
    itemTags: { tag: { createdAt: Date; id: string; name: string } | null }[];
  },
>(record: T) {
  const { itemTags, ...rest } = record;
  return {
    ...rest,
    tags: itemTags.map((it) => it.tag).filter(nonNullable),
  };
}

async function attachTags(itemId: string, tagIds: string[]) {
  if (tagIds.length === 0) {
    return;
  }

  await db
    .insert(itemTag)
    .values(tagIds.map((tagId) => ({ itemId, tagId })))
    .onConflictDoNothing();
}

function resolveOgMetadata(url?: string) {
  if (!url) {
    return Promise.resolve({ description: null, imageUrl: null, title: null });
  }
  return fetchOgMetadata(url);
}

export async function createItem(data: CreateItem, userId: string) {
  const ogData = await resolveOgMetadata(data.url);

  const [created] = await db
    .insert(item)
    .values({
      categoryId: data.categoryId,
      description: ogData.description,
      imageUrl: ogData.imageUrl,
      metadata: data.metadata ?? null,
      notes: data.notes ?? null,
      title: data.title ?? ogData.title,
      url: data.url ?? null,
      userId,
    })
    .returning();

  if (!created) {
    return status(500, "Failed to create item");
  }

  const tags = await upsertTags(data.tags, userId);
  await attachTags(
    created.id,
    tags.map((t) => t.id)
  );

  // Re-fetch with tags to return a consistent shape
  return getItemById(created.id, userId);
}

async function filterItemIdsByTags(
  userId: string,
  tagsParam: string
): Promise<string[]> {
  const tagNames = tagsParam.split(",").map((t) => t.trim().toLowerCase());

  const matchingTags = await db.query.tag.findMany({
    columns: { id: true },
    where: {
      name: {
        in: tagNames,
      },
      userId,
    },
  });

  if (matchingTags.length === 0) {
    return [];
  }

  const matchingItemTags = await db.query.itemTag.findMany({
    columns: { itemId: true },
    where: {
      tagId: {
        in: matchingTags.map((t) => t.id),
      },
    },
  });

  return matchingItemTags.map((it) => it.itemId);
}

export async function listItems(userId: string, query: ListItemQuery) {
  // Pre-filter item IDs by tags if requested
  let tagItemIds: string[] | undefined;
  if (query.tags) {
    tagItemIds = await filterItemIdsByTags(userId, query.tags);
    if (tagItemIds.length === 0) {
      return [];
    }
  }

  const pattern = query.search ? `%${query.search}%` : null;

  const rows = await db.query.item.findMany({
    columns: {
      userId: false,
    },
    orderBy: (i, { desc }) => desc(i.createdAt),
    where: {
      userId,
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(pattern
        ? { OR: [{ title: { ilike: pattern } }, { notes: { ilike: pattern } }] }
        : {}),
    },
    with: withItemTags,
  });

  return rows.map(flattenTags);
}

export async function getItemById(id: string, userId: string) {
  const found = await db.query.item.findFirst({
    columns: {
      userId: false,
    },
    where: {
      id,
      userId,
    },
    with: withItemTags,
  });

  if (!found) {
    return status(404, "Item not found");
  }

  return flattenTags(found);
}

async function syncItemTags(
  itemId: string,
  tagNames: string[],
  userId: string
) {
  await db.delete(itemTag).where(eq(itemTag.itemId, itemId));
  const tags = await upsertTags(tagNames, userId);
  await attachTags(
    itemId,
    tags.map((t) => t.id)
  );
}

export async function updateItem(id: string, data: UpdateItem, userId: string) {
  const existing = await db.query.item.findFirst({
    columns: { id: true },
    where: { id, userId },
  });

  if (!existing) {
    return status(404, "Item not found");
  }

  const { tags: tagNames, ...fields } = data;

  await db.update(item).set(fields).where(eq(item.id, id));

  if (tagNames !== undefined) {
    await syncItemTags(id, tagNames, userId);
  }

  // Re-fetch with tags to return consistent shape
  return getItemById(id, userId);
}

export async function deleteItem(id: string, userId: string) {
  const existing = await db.query.item.findFirst({
    columns: { id: true },
    where: { id, userId },
  });

  if (!existing) {
    return status(404, "Item not found");
  }

  await db.delete(itemTag).where(eq(itemTag.itemId, id));
  await db.delete(item).where(eq(item.id, id));

  return { success: true };
}
