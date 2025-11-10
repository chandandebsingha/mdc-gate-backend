import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const society = pgTable("society", {
	id: serial("id").primaryKey(),
	country: varchar("country", { length: 100 }).notNull(),
	state: varchar("state", { length: 100 }).notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	society: varchar("society", { length: 150 }).notNull(),
	buildingName: varchar("building_name", { length: 150 }).notNull(),
	block: varchar("block", { length: 50 }).notNull(),
});

export type Society = InferModel<typeof society>;
export type NewSociety = InferModel<typeof society, "insert">;
