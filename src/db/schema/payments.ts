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
import { society } from "./society";
import { paymentGroup } from "./paymentgroup";

export const payments = pgTable("payments", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	societyId: integer("society_id")
		.notNull()
		.references(() => society.id),
	amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
	paymentType: varchar("payment_type", { length: 50 }).notNull(),
	status: varchar("status", { length: 50 }).notNull().default("pending"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	dueDate: timestamp("due_date", { withTimezone: true }),
	paymentDate: timestamp("payment_date", { withTimezone: true }),
	receiptNumber: varchar("receipt_number", { length: 100 }),
	paymentReference: varchar("payment_reference"),
	fiscalYear: varchar("fiscal_year", { length: 20 }),
	paymentMethod: varchar("payment_method", { length: 50 }),
	period: varchar("period", { length: 50 }),
	description: varchar("description"),
	paymentGroupId: integer("payment_group_id")
		.notNull()
		.references(() => paymentGroup.id),

	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Payment = InferModel<typeof payments>;
export type NewPayment = InferModel<typeof payments, "insert">;
