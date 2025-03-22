ALTER TABLE "courses" ADD COLUMN "finalExamId" uuid;--> statement-breakpoint
ALTER TABLE "placeholders" ADD COLUMN "font_family" text DEFAULT 'Arial' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "questionnaire_id_idx" ON "course_questionnaires" USING btree ("questionnaire_id");