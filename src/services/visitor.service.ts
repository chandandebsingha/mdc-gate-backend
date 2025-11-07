import { db } from "../db";
import { visitors, NewVisitor } from "../db/schema/visitors";
import { eq } from "drizzle-orm";

export const approveVisitorService = async (
	payload: Omit<NewVisitor, "id" | "approved"> & { approved?: boolean }
) => {
	const [created] = await db
		.insert(visitors)
		.values({ ...payload, approved: true })
		.returning();
	return created;
};

export const listVisitorsService = async (userId: number) => {
	return db.select().from(visitors).where(eq(visitors.userId, userId));
};
