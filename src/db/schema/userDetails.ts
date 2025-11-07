import { pgTable, serial, integer, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import { users } from './users';

export const authorityEnum = pgEnum('authority', ['owner', 'tenant', 'family', 'admin']);
export const occupancyStatusEnum = pgEnum('occupancy_status', ['owner_occupied', 'tenant_occupied', 'vacant']);

export const userDetails = pgTable('user_details', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id).unique(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  society: varchar('society', { length: 150 }).notNull(),
  buildingName: varchar('building_name', { length: 150 }).notNull(),
  block: varchar('block', { length: 50 }).notNull(),
  authority: authorityEnum('authority').notNull().default('owner'),
  occupancyStatus: occupancyStatusEnum('occupancy_status').notNull().default('owner_occupied'),
  document: varchar('document', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserDetails = InferModel<typeof userDetails>;
export type NewUserDetails = InferModel<typeof userDetails, 'insert'>;
