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
	category: varchar("category", { length: 100 }).notNull(),
	subcategory: varchar("subcategory", { length: 100 }).notNull(),
	requestType: varchar("request_type", { length: 50 }).notNull(), // 'unit' or 'community'
	isUrgent: integer("is_urgent").notNull().default(0), // 0 or 1 (boolean)
	description: text("description").notNull(),
	imageUrl: varchar("image_url", { length: 500 }),
	status: varchar("status", { length: 50 }).notNull().default("open"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Complaint = InferModel<typeof complaints>;
export type NewComplaint = InferModel<typeof complaints, "insert">;
