ALTER TABLE "payments" ADD COLUMN "society_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "receipt_number" varchar(100);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_reference" varchar;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "fiscal_year" varchar(20);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_method" varchar(50);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "period" varchar(50);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;