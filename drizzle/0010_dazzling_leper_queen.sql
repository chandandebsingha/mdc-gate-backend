CREATE TABLE "payment_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"society_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'active'
);
--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_group" ADD CONSTRAINT "payment_group_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_group" ADD CONSTRAINT "payment_group_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_project_id_payment_group_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."payment_group"("id") ON DELETE no action ON UPDATE no action;