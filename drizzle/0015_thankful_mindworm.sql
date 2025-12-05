CREATE TABLE "gate_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"gate_entry" integer NOT NULL,
	"gate_exit" integer
);
--> statement-breakpoint
ALTER TABLE "gate_log" ADD CONSTRAINT "gate_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;