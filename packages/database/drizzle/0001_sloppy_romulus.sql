CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "forms_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" varchar(300) NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_field_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"description" varchar(300) NOT NULL,
	"placeholder" text,
	"isRequired" boolean DEFAULT false NOT NULL,
	"index" numeric NOT NULL,
	"type" "field_type_enum" NOT NULL,
	"form_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_field_table_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
ALTER TABLE "forms_table" ADD CONSTRAINT "forms_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_field_table" ADD CONSTRAINT "form_field_table_form_id_forms_table_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms_table"("id") ON DELETE no action ON UPDATE no action;