ALTER TABLE "payments" RENAME COLUMN "project_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_project_id_payment_group_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_group_id_payment_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."payment_group"("id") ON DELETE no action ON UPDATE no action;