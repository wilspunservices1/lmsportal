ALTER TABLE "certificates" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "file_path" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "course_id" text;