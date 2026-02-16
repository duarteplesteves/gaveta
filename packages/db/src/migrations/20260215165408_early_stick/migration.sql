CREATE TABLE "categories" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"is_default" boolean DEFAULT false NOT NULL,
	"metadata_schema" jsonb,
	"name" text NOT NULL UNIQUE,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"image_url" text,
	"metadata" jsonb,
	"notes" text,
	"title" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"url" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_tags" (
	"item_id" uuid,
	"tag_id" uuid,
	CONSTRAINT "item_tags_pkey" PRIMARY KEY("item_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "tags_name_user_id_unique" UNIQUE("name","user_id")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_item_id_items_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;