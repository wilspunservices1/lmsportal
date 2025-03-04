CREATE TABLE IF NOT EXISTS "SavedCertificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificateId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"courseId" uuid,
	"courseTitle" text,
	"certificateData" text NOT NULL,
	"placeholders" jsonb NOT NULL,
	"isIssued" boolean DEFAULT false NOT NULL,
	"issueDate" timestamp,
	"expiryDate" timestamp,
	"certificateNumber" text NOT NULL,
	"verificationCode" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "SavedCertificates_certificateNumber_unique" UNIQUE("certificateNumber"),
	CONSTRAINT "SavedCertificates_verificationCode_unique" UNIQUE("verificationCode")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SavedCertificates" ADD CONSTRAINT "SavedCertificates_certificateId_Certification_id_fk" FOREIGN KEY ("certificateId") REFERENCES "public"."Certification"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SavedCertificates" ADD CONSTRAINT "SavedCertificates_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
