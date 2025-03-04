CREATE TABLE IF NOT EXISTS "course_questionnaires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"questionnaire_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_slug_unique";--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_certificateId_Certification_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_questionnaires" ADD CONSTRAINT "course_questionnaires_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_questionnaires" ADD CONSTRAINT "course_questionnaires_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "slug";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "lesson";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "duration";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "featured";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "price";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "estimatedPrice";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "isFree";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "tag";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "skillLevel";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "categories";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "insName";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "thumbnail";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "demoVideoUrl";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "isPublished";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "enrolledCount";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "discount";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "extras";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "reviews";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "comments";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "certificateId";