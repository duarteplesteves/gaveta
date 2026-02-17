import { db } from "@gaveta/db";
import { eq } from "@gaveta/db/drizzle";
import { category, item } from "@gaveta/db/schema";
import { status } from "elysia";

import type { CreateCategory, UpdateCategory } from "./model";

export function listCategories(userId: string) {
  return db.query.category.findMany({
    where: {
      userId,
    },
  });
}

export async function createCategory(data: CreateCategory, userId: string) {
  const [created] = await db
    .insert(category)
    .values({
      isDefault: false,
      name: data.name,
      userId,
    })
    .returning();

  if (!created) {
    return status(500, "Failed to create category");
  }

  return created;
}

export async function updateCategory(
  id: string,
  data: UpdateCategory,
  userId: string
) {
  const existing = await db.query.category.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existing) {
    return status(404, "Category not found");
  }

  if (existing.isDefault) {
    return status(403, "Cannot modify a default category");
  }

  const [updated] = await db
    .update(category)
    .set({ name: data.name })
    .where(eq(category.id, id))
    .returning();

  if (!updated) {
    return status(500, "Failed to update category");
  }

  return updated;
}

export async function deleteCategory(id: string, userId: string) {
  const existing = await db.query.category.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existing) {
    return status(404, "Category not found");
  }

  if (existing.isDefault) {
    return status(403, "Cannot delete a default category");
  }

  // Move items to "Other" category before deleting
  const otherCategory = await db.query.category.findFirst({
    columns: { id: true },
    where: {
      name: "Other",
      userId,
    },
  });

  if (otherCategory) {
    await db
      .update(item)
      .set({ categoryId: otherCategory.id })
      .where(eq(item.categoryId, id));
  }

  await db.delete(category).where(eq(category.id, id));

  return { success: true };
}
