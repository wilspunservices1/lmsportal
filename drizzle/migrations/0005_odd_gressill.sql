ALTER TABLE "Certification" ADD COLUMN "placeholders" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "course_id" uuid;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "video_id" uuid;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "is_required" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "min_pass_score" integer DEFAULT 80;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
