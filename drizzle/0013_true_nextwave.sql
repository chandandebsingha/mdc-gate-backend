ALTER TABLE "visitors" RENAME COLUMN "date" TO "visitor_type";--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "date_of_visit" date NOT NULL;--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "time_of_visit" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "visit_end_time" varchar(50);--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "visitor_phone" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "note" varchar(255);--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "otp" varchar(6);--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;