import { db } from "../db";
import { paymentGroup, NewPaymentGroup } from "../db/schema/paymentgroup";
import { eq, and, desc } from "drizzle-orm";

export const createPaymentGroupService = async (
	payload: Omit<NewPaymentGroup, "id" | "createdAt" | "updatedAt">
) => {
	const [created] = await db.insert(paymentGroup).values(payload).returning();
	return created;
};

export const listPaymentGroupsBySocietyService = async (societyId: number) => {
	return db
		.select()
		.from(paymentGroup)
		.where(eq(paymentGroup.societyId, societyId))
		.orderBy(desc(paymentGroup.createdAt));
};

export const getPaymentGroupByIdService = async (id: number) => {
	const [group] = await db
		.select()
		.from(paymentGroup)
		.where(eq(paymentGroup.id, id));
	return group;
};

export const updatePaymentGroupService = async (
	id: number,
	payload: Partial<Omit<NewPaymentGroup, "id" | "createdAt">>
) => {
	const [updated] = await db
		.update(paymentGroup)
		.set({ ...payload, updatedAt: new Date() })
		.where(eq(paymentGroup.id, id))
		.returning();
	return updated;
};

export const deletePaymentGroupService = async (id: number) => {
	const [deleted] = await db
		.delete(paymentGroup)
		.where(eq(paymentGroup.id, id))
		.returning();
	return deleted;
};

export const listActivePaymentGroupsBySocietyService = async (
	societyId: number
) => {
	return db
		.select()
		.from(paymentGroup)
		.where(
			and(
				eq(paymentGroup.societyId, societyId),
				eq(paymentGroup.status, "active")
			)
		)
		.orderBy(desc(paymentGroup.createdAt));
};
