import { db } from "../db";
import { userDetails, NewUserDetails } from "../db/schema/userDetails";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

export async function getUserDetailsByUserId(userId: number) {
	const rows = await db
		.select()
		.from(userDetails)
		.where(eq(userDetails.userId, userId));
	if (!rows[0]) return null;
	// Return all fields, but add societyId as alias for frontend
	return {
		...rows[0],
		societyId: rows[0].societyId,
	};
}

export async function upsertUserDetailsByUserId(
	userId: number,
	input: Omit<NewUserDetails, "id" | "userId" | "createdAt">
) {
	const existing = await getUserDetailsByUserId(userId);
	if (existing) {
		const [updated] = await db
			.update(userDetails)
			.set({
				country: input.country,
				state: input.state,
				city: input.city,
				society: input.society,
				societyId: input.societyId,
				buildingName: input.buildingName,
				block: input.block,
				authority: input.authority ?? existing.authority,
				occupancyStatus: input.occupancyStatus ?? existing.occupancyStatus,
				document: input.document,
			})
			.where(eq(userDetails.userId, userId))
			.returning();

		// Also persist societyId to users table (link user to society)
		if (input.societyId && Number.isInteger(Number(input.societyId))) {
			await db
				.update(users)
				.set({ societyId: Number(input.societyId) })
				.where(eq(users.id, userId));
		}
		return updated;
	} else {
		const [created] = await db
			.insert(userDetails)
			.values({ userId, ...input, societyId: input.societyId })
			.returning();
		// Mirror societyId into users table
		if (input.societyId && Number.isInteger(Number(input.societyId))) {
			await db
				.update(users)
				.set({ societyId: Number(input.societyId) })
				.where(eq(users.id, userId));
		}
		return created;
	}
}
