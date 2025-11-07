import { db } from "../db";
import { amenities } from "../db/schema/amenities";
import { eq, sql } from "drizzle-orm";

export const listAmenitiesService = async () => {
	return db.select().from(amenities);
};

export const bookAmenityService = async (amenityId: number) => {
	// decrement availableSlots atomically if > 0
	const result = await db
		.update(amenities)
		.set({ availableSlots: sql`${amenities.availableSlots} - 1` })
		.where(eq(amenities.id, amenityId))
		.returning();
	return result[0];
};
