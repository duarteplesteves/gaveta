/* oxlint-disable jest/require-hook, prefer-await-to-callbacks, prefer-await-to-then */
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import { category } from "./schema/category";
import { user } from "./schema/user";

dotenv.config({ path: "../../apps/server/.env" });

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

const PREDEFINED_CATEGORIES = [
  {
    metadataSchema: [
      { key: "location", label: "Location", type: "text" },
      { key: "cuisine", label: "Cuisine", type: "text" },
      { key: "priceRange", label: "Price Range", type: "number" },
    ],
    name: "Restaurants",
  },
  {
    metadataSchema: [
      { key: "source", label: "Source", type: "text" },
      { key: "topic", label: "Topic", type: "text" },
    ],
    name: "Articles",
  },
  {
    metadataSchema: [
      { key: "source", label: "Source", type: "text" },
      { key: "duration", label: "Duration", type: "text" },
    ],
    name: "Videos",
  },
  {
    metadataSchema: [
      { key: "price", label: "Price", type: "text" },
      { key: "store", label: "Store", type: "text" },
    ],
    name: "Products",
  },
  {
    metadataSchema: [
      { key: "location", label: "Location", type: "text" },
      { key: "type", label: "Type", type: "text" },
    ],
    name: "Places",
  },
  {
    metadataSchema: [
      { key: "genre", label: "Genre", type: "text" },
      { key: "platform", label: "Platform", type: "text" },
    ],
    name: "TV Series",
  },
  {
    metadataSchema: [
      { key: "author", label: "Author", type: "text" },
      { key: "genre", label: "Genre", type: "text" },
    ],
    name: "Books",
  },
  {
    metadataSchema: [
      { key: "genre", label: "Genre", type: "text" },
      { key: "platform", label: "Platform", type: "text" },
    ],
    name: "Movies",
  },
  {
    metadataSchema: [
      { key: "artist", label: "Artist", type: "text" },
      { key: "type", label: "Type", type: "select" },
    ],
    name: "Music",
  },
  {
    metadataSchema: null,
    name: "Other",
  },
] as const;

async function resolveUserId(userIdArg: string | undefined): Promise<string> {
  if (userIdArg) {
    return userIdArg;
  }

  const [firstUser] = await db.select({ id: user.id }).from(user).limit(1);
  if (!firstUser) {
    console.error(
      "No users found. Create a user first, or pass a userId argument: bun run src/seed.ts <userId>"
    );
    process.exit(1);
  }

  console.log(`No userId provided, using first user: ${firstUser.id}`);
  return firstUser.id;
}

async function seedCategories(userId: string) {
  for (const cat of PREDEFINED_CATEGORIES) {
    const [existing] = await db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.name, cat.name))
      .limit(1);

    if (existing) {
      console.log(`Category "${cat.name}" already exists, skipping.`);
      continue;
    }

    await db.insert(category).values({
      isDefault: true,
      metadataSchema: cat.metadataSchema,
      name: cat.name,
      userId,
    });

    console.log(`Created category "${cat.name}"`);
  }
}

async function seed() {
  const userId = await resolveUserId(process.argv[2]);
  await seedCategories(userId);
  console.log("Seed complete.");
}

seed().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
