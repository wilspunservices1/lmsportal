ALTER TABLE "Certification" ADD COLUMN "certificateId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Certification" ADD CONSTRAINT "Certification_certificateId_CertificateWithPlaceholders_id_fk" FOREIGN KEY ("certificateId") REFERENCES "public"."CertificateWithPlaceholders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
