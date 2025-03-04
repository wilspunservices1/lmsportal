CREATE TABLE IF NOT EXISTS "CertificateWithPlaceholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ownerId" uuid NOT NULL,
	"certificateData" text NOT NULL,
	"description" text,
	"isPublished" boolean DEFAULT false NOT NULL,
	"uniqueIdentifier" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"expirationDate" timestamp,
	"isRevocable" boolean DEFAULT true NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"placeholderId" uuid NOT NULL,
	"placeholderValue" text NOT NULL,
	"positionX" text NOT NULL,
	"positionY" text NOT NULL,
	"certificateId" uuid NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "CertificateWithPlaceholders_uniqueIdentifier_unique" UNIQUE("uniqueIdentifier")
);
--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "questionnaire_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "question" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "options" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "correct_answer" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "correct_answer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "lesson" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "duration" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "estimatedPrice" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "isFree" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "tag" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "skillLevel" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "categories" json DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "insName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "demoVideoUrl" varchar(500);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "isPublished" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "enrolledCount" numeric(10, 0) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "discount" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "extras" json DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "reviews" json DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "comments" json DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "certificateId" uuid;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "is_deleted" text DEFAULT 'false' NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CertificateWithPlaceholders" ADD CONSTRAINT "CertificateWithPlaceholders_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_certificateId_Certification_id_fk" FOREIGN KEY ("certificateId") REFERENCES "public"."Certification"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Certification" DROP COLUMN IF EXISTS "isDeleted";--> statement-breakpoint
ALTER TABLE "Certification" DROP COLUMN IF EXISTS "deletedAt";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "questionnaires" DROP COLUMN IF EXISTS "chapter_id";--> statement-breakpoint
ALTER TABLE "questionnaires" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_slug_unique" UNIQUE("slug");