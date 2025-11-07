import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "./users";

export const familyMembers = pgTable("family_members", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	name: varchar("name", { length: 100 }).notNull(),
	relation: varchar("relation", { length: 50 }).notNull(),
	phone: varchar("phone", { length: 15 }),
});

export type FamilyMember = InferModel<typeof familyMembers>;
export type NewFamilyMember = InferModel<typeof familyMembers, "insert">;
