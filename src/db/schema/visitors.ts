import {
	pgTable,
	serial,
	integer,
	varchar,
	boolean,
	date,
} from "drizzle-orm/pg-core";
import { InferModel, not } from "drizzle-orm";
import { users } from "./users";

export const visitors = pgTable("visitors", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	visitorType: varchar("visitor_type", { length: 50 }).notNull(),
	dateOfVisit: date("date_of_visit").notNull(),
	timeOfVisit: varchar("time_of_visit", { length: 50 }).notNull(),
	visitEndTime: varchar("visit_end_time", { length: 50 }),
	visitorName: varchar("visitor_name", { length: 150 }).notNull(),
	visitorPhone: varchar("visitor_phone", { length: 20 }).notNull(),
	vehicleNumber: varchar("vehicle_number", { length: 50 }),
	note: varchar("note", { length: 255 }),
	approved: boolean("approved").notNull().default(false),
	otp: varchar("otp", { length: 6 }),
	createdAt: date("created_at").notNull().defaultNow(),
});

export type Visitor = InferModel<typeof visitors>;
export type NewVisitor = InferModel<typeof visitors, "insert">;
