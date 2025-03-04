CREATE TABLE IF NOT EXISTS "managecertificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"course_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_deleted" text DEFAULT 'false' NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP TABLE "certificates";