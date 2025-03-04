ALTER TABLE "Certification" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "Certification" ADD COLUMN "deletedAt" timestamp;