import { db } from "@gaveta/db";
import { eq } from "@gaveta/db/drizzle";
import { itemTag, tag } from "@gaveta/db/schema";
import { status } from "elysia";

export function listTags(userId: string, search?: string) {
  return db.query.tag.findMany({
    where: {
      userId,
      ...(search ? { name: { ilike: `%${search}%` } } : {}),
    },
  });
}

export async function deleteTag(id: string, userId: string) {
  const existing = await db.query.tag.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return status(404, "Tag not found");
  }

  await db.delete(itemTag).where(eq(itemTag.tagId, id));
  await db.delete(tag).where(eq(tag.id, id));

  return { success: true };
}

async function findOrCreateTag(name: string, userId: string) {
  const existing = await db.query.tag.findFirst({
    where: { name, userId },
  });

  if (existing) {
    return existing;
  }

  const [created] = await db.insert(tag).values({ name, userId }).returning();

  return created;
}

/**
 * Upsert tags by name for a given user.
 * Returns the tag records (existing or newly created).
 */
export async function upsertTags(names: string[], userId: string) {
  if (names.length === 0) {
    return [];
  }

  const unique = [...new Set(names.map((n) => n.trim().toLowerCase()))].filter(
    (n) => n.length > 0
  );

  const results = await Promise.all(
    unique.map((name) => findOrCreateTag(name, userId))
  );

  return results.filter((r): r is NonNullable<typeof r> => r !== undefined);
}
