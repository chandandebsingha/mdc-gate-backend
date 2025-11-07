import {
	pgTable,
	serial,
	integer,
	varchar,
	boolean,
	date,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "./users";

export const visitors = pgTable("visitors", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	visitorName: varchar("visitor_name", { length: 150 }).notNull(),
	vehicleNumber: varchar("vehicle_number", { length: 50 }),
	approved: boolean("approved").notNull().default(false),
	date: date("date").notNull(),
});

export type Visitor = InferModel<typeof visitors>;
export type NewVisitor = InferModel<typeof visitors, "insert">;
