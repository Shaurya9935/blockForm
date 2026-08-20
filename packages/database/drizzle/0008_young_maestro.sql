CREATE TYPE "public"."form_experience" AS ENUM('journey', 'scroll');--> statement-breakpoint
ALTER TABLE "forms_table" ADD COLUMN "form_experience" "form_experience" DEFAULT 'journey';