import {
	pgTable,
	serial,
	integer,
	varchar,
	timestamp,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "./users";

export const notices = pgTable("notices", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    content: varchar("content", { length: 2000 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});