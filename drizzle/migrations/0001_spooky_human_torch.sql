CREATE TABLE IF NOT EXISTS "certificates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "courseId" uuid NOT NULL,
  "enabled" boolean NOT NULL,
  "orientation" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE
);
