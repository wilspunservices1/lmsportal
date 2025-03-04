CREATE TABLE IF NOT EXISTS "CertificateTracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificateId" uuid NOT NULL,
	"verificationCode" text NOT NULL,
	"holderName" text NOT NULL,
	"issueDate" timestamp NOT NULL,
	"expiryDate" timestamp,
	"lastVerifiedAt" timestamp,
	"status" text NOT NULL,
	"grade" text,
	"score" text,
	"digitalSignature" text,
	"verificationHistory" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "CertificateTracking_verificationCode_unique" UNIQUE("verificationCode")
);
--> statement-breakpoint
ALTER TABLE "Certification" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "Certification" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CertificateTracking" ADD CONSTRAINT "CertificateTracking_certificateId_Certification_id_fk" FOREIGN KEY ("certificateId") REFERENCES "public"."Certification"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "certificates" DROP COLUMN IF EXISTS "file_path";