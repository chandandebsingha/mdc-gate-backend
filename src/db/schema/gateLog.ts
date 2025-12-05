import {
	pgTable,
	serial,
	integer,
	varchar,
	timestamp,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "./users";

export const gateLog = pgTable("gate_log", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	gateEntry: integer("gate_entry").notNull(),
	gateExit: integer("gate_exit"),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type GateLog = InferModel<typeof gateLog>;
export type NewGateLog = InferModel<typeof gateLog, "insert">;
