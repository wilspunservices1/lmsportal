ALTER TABLE "managecertificates" ADD COLUMN "course_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Placeholders" ADD COLUMN "label" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Placeholders" ADD COLUMN "value" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Placeholders" ADD COLUMN "color" text DEFAULT '#000000' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CertificateWithPlaceholders" ADD CONSTRAINT "CertificateWithPlaceholders_placeholderId_Placeholders_id_fk" FOREIGN KEY ("placeholderId") REFERENCES "public"."Placeholders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
