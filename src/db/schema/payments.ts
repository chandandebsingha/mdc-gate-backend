import {
	pgTable,
	serial,
	integer,
	varchar,
	numeric,
	timestamp,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "./users";

export const payments = pgTable("payments", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
	paymentType: varchar("payment_type", { length: 50 }).notNull(),
	status: varchar("status", { length: 50 }).notNull().default("pending"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Payment = InferModel<typeof payments>;
export type NewPayment = InferModel<typeof payments, "insert">;
