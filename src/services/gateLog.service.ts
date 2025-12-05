import { db } from "../db";
import { gateLog } from "../db/schema/gateLog";
import { users } from "../db/schema/users";
import { visitors } from "../db/schema/visitors";
import { eq, desc } from "drizzle-orm";

export const listGateLogsService = async (userId: number) => {
	// Determine society of requesting user
	const [requestingUser] = await db
		.select({ societyId: users.societyId })
		.from(users)
		.where(eq(users.id, userId));

	if (!requestingUser?.societyId) return [];

	// Return gate logs for visitors belonging to same society
	return db
		.select({
			id: gateLog.id,
			gateEntry: gateLog.gateEntry,
			gateExit: gateLog.gateExit,
			updatedAt: gateLog.updatedAt,
			visitorName: visitors.visitorName,
			visitorPhone: visitors.visitorPhone,
			dateOfVisit: visitors.dateOfVisit,
			timeOfVisit: visitors.timeOfVisit,
			visitEndTime: visitors.visitEndTime,
			approved: visitors.approved,
			otp: visitors.otp,
			creatorUserId: visitors.userId,
		})
		.from(gateLog)
		.innerJoin(visitors, eq(gateLog.gateEntry, visitors.id))
		.innerJoin(users, eq(visitors.userId, users.id))
		.where(eq(users.societyId, requestingUser.societyId))
		.orderBy(desc(gateLog.updatedAt));
};
