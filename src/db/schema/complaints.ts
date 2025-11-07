import {
	pgTable,
	serial,
	integer,
	varchar,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "./users";

export const complaints = pgTable("complaints", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	title: varchar("title", { length: 200 }).notNull(),
	description: text("description").notNull(),
	status: varchar("status", { length: 50 }).notNull().default("open"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Complaint = InferModel<typeof complaints>;
export type NewComplaint = InferModel<typeof complaints, "insert">;
