ALTER TABLE "Placeholders" ADD COLUMN "fontSize" numeric(10, 2) DEFAULT '12' NOT NULL;--> statement-breakpoint
ALTER TABLE "Placeholders" ADD COLUMN "isVisible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "chapter_id" text;--> statement-breakpoint
ALTER TABLE "Placeholders" DROP COLUMN IF EXISTS "font_size";--> statement-breakpoint
ALTER TABLE "Placeholders" DROP COLUMN IF EXISTS "is_visible";