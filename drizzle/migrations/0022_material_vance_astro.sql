CREATE TABLE "certification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"certificate_data_url" text NOT NULL,
	"description" text DEFAULT 'description' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"unique_identifier" text NOT NULL,
	"title" text DEFAULT 'title_here' NOT NULL,
	"expiration_date" timestamp,
	"is_revocable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"metadata" jsonb,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"orientation" text DEFAULT 'landscape' NOT NULL,
	"max_download" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"course_id" uuid NOT NULL,
	CONSTRAINT "Certification_uniqueIdentifier_unique" UNIQUE("unique_identifier")
);
--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"course_id" uuid,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placeholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificate_id" uuid NOT NULL,
	"key" text NOT NULL,
	"discount" integer DEFAULT 0,
	"x" numeric(10, 2) DEFAULT '0' NOT NULL,
	"y" numeric(10, 2) DEFAULT '0' NOT NULL,
	"font_size" numeric DEFAULT '12' NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"label" text DEFAULT 'PlaceHolderLabel' NOT NULL,
	"color" text DEFAULT '#000000' NOT NULL,
	"value" text DEFAULT 'PlaceHolderValue' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "CertificateWithPlaceholders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Certification" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Placeholders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "CertificateWithPlaceholders" CASCADE;--> statement-breakpoint
DROP TABLE "Certification" CASCADE;--> statement-breakpoint
DROP TABLE "Placeholders" CASCADE;--> statement-breakpoint
ALTER TABLE "CertificateIssuance" DROP CONSTRAINT "CertificateIssuance_certificateId_Certification_id_fk";
--> statement-breakpoint
ALTER TABLE "CertificateTracking" DROP CONSTRAINT "CertificateTracking_certificateId_Certification_id_fk";
--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_questionnaireId_questionnaires_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_certificateId_Certification_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_questionnaire_id_questionnaires_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_questionnaire_id_questionnaires_id_fk";
--> statement-breakpoint
ALTER TABLE "managecertificates" ALTER COLUMN "course_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "questionnaires" ALTER COLUMN "course_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "questionnaires" ALTER COLUMN "chapter_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ALTER COLUMN "questionnaire_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "finalExamId" uuid;--> statement-breakpoint
ALTER TABLE "certification" ADD CONSTRAINT "certification_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "certification" ADD CONSTRAINT "Certification_ownerId_User_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placeholders" ADD CONSTRAINT "placeholders_certificate_id_certification_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certification"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "placeholders" ADD CONSTRAINT "placeholders_certificate_id_certifications_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certification"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CertificateIssuance" ADD CONSTRAINT "CertificateIssuance_certificateId_certification_id_fk" FOREIGN KEY ("certificateId") REFERENCES "public"."certification"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CertificateTracking" ADD CONSTRAINT "CertificateTracking_certificateId_certification_id_fk" FOREIGN KEY ("certificateId") REFERENCES "public"."certification"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "managecertificates" ADD CONSTRAINT "managecertificates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "managecertificates" ADD CONSTRAINT "managecertificates_courseFk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE cascade ON UPDATE cascade;