import { db } from "../db";
import { payments, NewPayment } from "../db/schema/payments";
import { eq } from "drizzle-orm";

export const createPaymentService = async (
	payload: Omit<NewPayment, "id" | "createdAt" | "status"> & { status?: string }
) => {
	const [created] = await db.insert(payments).values(payload).returning();
	return created;
};

export const listPaymentsByUserService = async (userId: number) => {
	return db.select().from(payments).where(eq(payments.userId, userId));
};
