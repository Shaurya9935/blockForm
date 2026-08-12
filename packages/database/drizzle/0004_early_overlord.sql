ALTER TYPE "public"."field_type_enum" ADD VALUE 'SELECT';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'CHECKBOX';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'RATING';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'DATE';--> statement-breakpoint
ALTER TABLE "form_field_table" ADD COLUMN "config" json;--> statement-breakpoint
ALTER TABLE "form_field_table" ADD COLUMN "workflow_x" real;--> statement-breakpoint
ALTER TABLE "form_field_table" ADD COLUMN "workflow_y" real;