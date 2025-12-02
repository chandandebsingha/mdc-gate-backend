import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	timestamp,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { society } from "./society";
import { users } from "./users";

export const paymentGroup = pgTable("payment_group", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	societyId: integer("society_id")
		.notNull()
		.references(() => society.id),
	createdBy: integer("created_by")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	status: varchar("status", { length: 50 }).default("active"),
});

export type PaymentGroup = InferModel<typeof paymentGroup>;
export type NewPaymentGroup = InferModel<typeof paymentGroup, "insert">;
