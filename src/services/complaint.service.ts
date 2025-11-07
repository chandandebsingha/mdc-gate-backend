import { db } from "../db";
import { complaints, NewComplaint } from "../db/schema/complaints";
import { eq, and } from "drizzle-orm";

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
