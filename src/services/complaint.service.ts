import { db } from "../db";
import { complaints, NewComplaint } from "../db/schema/complaints";
import { userDetails } from "../db/schema/userDetails";
import { users } from "../db/schema/users";
import { eq, inArray, and } from "drizzle-orm";

export const createComplaintService = async (
	payload: Omit<NewComplaint, "id" | "createdAt" | "status"> & {
		status?: string;
	}
) => {
	const [created] = await db.insert(complaints).values(payload).returning();
	return created;
};

export const getComplaintsByUserService = async (userId: number) => {
	const rows = await db
		.select()
		.from(complaints)
		.where(eq(complaints.userId, userId))
		.orderBy(complaints.createdAt);
	return rows;
};

export const getComplaintsBySocietyService = async (managerId: number) => {
	try {
		// First, get the manager's society
		const managerDetails = await db
			.select()
			.from(userDetails)
			.where(eq(userDetails.userId, managerId))
			.limit(1);

		if (!managerDetails || managerDetails.length === 0) {
			console.error(
				`[getComplaintsBySocietyService] Manager details not found for userId: ${managerId}`
			);
			// Return all complaints if manager doesn't have details (fallback for testing/admin)
			console.log(
				`[getComplaintsBySocietyService] Returning all complaints as fallback`
			);
			const rows = await db
				.select({
					id: complaints.id,
					userId: complaints.userId,
					category: complaints.category,
					subcategory: complaints.subcategory,
					requestType: complaints.requestType,
					isUrgent: complaints.isUrgent,
					description: complaints.description,
					imageUrl: complaints.imageUrl,
					status: complaints.status,
					createdAt: complaints.createdAt,
					userName: users.name,
					userEmail: users.email,
				})
				.from(complaints)
				.innerJoin(users, eq(complaints.userId, users.id))
				.orderBy(complaints.createdAt);
			return rows;
		}

		const managerSociety = managerDetails[0].society;
		console.log(
			`[getComplaintsBySocietyService] Fetching complaints for society: ${managerSociety}`
		);

		// Get all user IDs in the same society
		const usersInSociety = await db
			.select({ userId: userDetails.userId })
			.from(userDetails)
			.where(eq(userDetails.society, managerSociety));

		console.log(
			`[getComplaintsBySocietyService] Found ${usersInSociety.length} users in society`
		);

		const userIds = usersInSociety.map((u) => u.userId);

		if (userIds.length === 0) {
			console.log(
				`[getComplaintsBySocietyService] No users found in society`
			);
			return [];
		}

		// Get complaints from all users in that society
		const rows = await db
			.select({
				id: complaints.id,
				userId: complaints.userId,
				category: complaints.category,
				subcategory: complaints.subcategory,
				requestType: complaints.requestType,
				isUrgent: complaints.isUrgent,
				description: complaints.description,
				imageUrl: complaints.imageUrl,
				status: complaints.status,
				createdAt: complaints.createdAt,
				userName: users.name,
				userEmail: users.email,
			})
			.from(complaints)
			.innerJoin(users, eq(complaints.userId, users.id))
			.where(inArray(complaints.userId, userIds))
			.orderBy(complaints.createdAt);

		console.log(
			`[getComplaintsBySocietyService] Found ${rows.length} complaints`
		);

		return rows;
	} catch (error: any) {
		console.error(
			`[getComplaintsBySocietyService] Error fetching complaints:`,
			error
		);
		throw error;
	}
};

export const updateComplaintStatusService = async (
	id: number,
	status: string,
	userId?: number
) => {
	const where = userId
		? and(eq(complaints.id, id), eq(complaints.userId, userId))
		: eq(complaints.id, id);
	const [updated] = await db
		.update(complaints)
		.set({ status })
		.where(where)
		.returning();
	return updated;
};
