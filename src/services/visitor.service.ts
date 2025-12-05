import { db } from "../db";
import { visitors, NewVisitor } from "../db/schema/visitors";
import { users } from "../db/schema/users";
import { gateLog } from "../db/schema/gateLog";
import { eq } from "drizzle-orm";

export const approveVisitorService = async (
	payload: Omit<NewVisitor, "id" | "approved"> & { approved?: boolean }
) => {
	const [created] = await db
		.insert(visitors)
		.values({ ...payload, approved: false })
		.returning();
	return created;
};

export const listVisitorsService = async (userId: number) => {
	// Get the societyId of the requesting user
	const [requestingUser] = await db
		.select({ societyId: users.societyId })
		.from(users)
		.where(eq(users.id, userId));

	if (!requestingUser?.societyId) {
		return [];
	}

	// Get all visitors whose userId belongs to the same society
	const result = await db
		.select({
			id: visitors.id,
			userId: visitors.userId,
			visitorType: visitors.visitorType,
			dateOfVisit: visitors.dateOfVisit,
			timeOfVisit: visitors.timeOfVisit,
			visitEndTime: visitors.visitEndTime,
			visitorName: visitors.visitorName,
			visitorPhone: visitors.visitorPhone,
			vehicleNumber: visitors.vehicleNumber,
			note: visitors.note,
			approved: visitors.approved,
			otp: visitors.otp,
			createdAt: visitors.createdAt,
		})
		.from(visitors)
		.innerJoin(users, eq(visitors.userId, users.id))
		.where(eq(users.societyId, requestingUser.societyId));

	return result;
};

export const giveEntryService = async (
	visitorId: number,
	guardUserId: number
) => {
	// Fetch guard's society
	const [guard] = await db
		.select({ societyId: users.societyId })
		.from(users)
		.where(eq(users.id, guardUserId));

	if (!guard?.societyId) {
		throw new Error("Guard is not linked to a society");
	}

	// Fetch visitor with creator's society
	const [visitorRow] = await db
		.select({
			visitorId: visitors.id,
			visitorUserId: visitors.userId,
			societyId: users.societyId,
		})
		.from(visitors)
		.innerJoin(users, eq(visitors.userId, users.id))
		.where(eq(visitors.id, visitorId));

	if (!visitorRow) {
		throw new Error("Visitor not found");
	}

	if (visitorRow.societyId !== guard.societyId) {
		throw new Error("Not authorized to update this visitor");
	}

	const [updated] = await db
		.update(visitors)
		.set({ approved: true })
		.where(eq(visitors.id, visitorId))
		.returning();

	await db.insert(gateLog).values({
		userId: visitorRow.visitorUserId,
		gateEntry: visitorId,
	});

	return updated;
};
