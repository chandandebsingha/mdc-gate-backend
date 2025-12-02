ALTER TABLE "payments" RENAME COLUMN "group_id" TO "payment_group_id";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_group_id_payment_group_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_group_id_payment_group_id_fk" FOREIGN KEY ("payment_group_id") REFERENCES "public"."payment_group"("id") ON DELETE no action ON UPDATE no action;