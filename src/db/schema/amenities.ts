import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	numeric,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const amenities = pgTable("amenities", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 150 }).notNull(),
	description: text("description"),
	availableSlots: integer("available_slots").notNull().default(0),
	price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
});

export type Amenity = InferModel<typeof amenities>;
export type NewAmenity = InferModel<typeof amenities, "insert">;
