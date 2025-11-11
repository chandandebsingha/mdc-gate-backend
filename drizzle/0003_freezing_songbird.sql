ALTER TABLE "complaints" RENAME COLUMN "title" TO "subcategory";--> statement-breakpoint
ALTER TABLE "complaints" ALTER COLUMN "subcategory" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "category" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "request_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "is_urgent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "image_url" varchar(500);