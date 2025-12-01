import {
	pgTable,
	serial,
	varchar,
	timestamp,
	integer,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { society } from "./society";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	email: varchar("email", { length: 150 }).notNull().unique(),
	phone: varchar("phone", { length: 15 }),
	role: varchar("role", { length: 50 }).default("resident").notNull(),
	roleStatus: varchar("role_status", { length: 20 }).default("approved"),
	societyId: integer("society_id").references(() => society.id),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
