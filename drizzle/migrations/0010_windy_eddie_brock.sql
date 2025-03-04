ALTER TABLE "questionnaires" DROP CONSTRAINT "questionnaires_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "questionnaires" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questionnaires" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questionnaires" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questionnaires" ALTER COLUMN "course_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "questionnaire_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "question" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "options" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "correct_answer" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "correct_answer" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "chapter_id" text;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "questionnaires" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "questionnaires" DROP COLUMN IF EXISTS "video_id";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "updated_at";