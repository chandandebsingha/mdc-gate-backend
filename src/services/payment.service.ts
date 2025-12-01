import { db } from "../db";
import { payments, NewPayment } from "../db/schema/payments";
import { eq, desc, sql } from "drizzle-orm";

export const createPaymentService = async (
	payload: Omit<NewPayment, "id" | "createdAt" | "status"> & { status?: string }
) => {
	const [created] = await db.insert(payments).values(payload).returning();
	return created;
};

export const listPaymentsByUserService = async (userId: number) => {
	return db.select().from(payments).where(eq(payments.userId, userId));
};

export const createBulkPaymentRequestsService = async (payload: {
	requests: Array<{
		userId: number;
		societyId: number;
		amount: number;
		description: string;
		status: string;
		paymentType: string;
	}>;
}) => {
	// Get the highest project_id from database
	const maxProjectIdResult = await db
		.select({ maxId: sql<number>`COALESCE(MAX(${payments.projectId}), 0)` })
		.from(payments);

	const nextProjectId = (maxProjectIdResult[0]?.maxId || 0) + 1;

	const paymentRecords = payload.requests.map((req) => ({
		userId: req.userId,
		societyId: req.societyId,
		amount: req.amount.toString(),
		paymentType: req.paymentType,
		description: req.description,
		status: req.status,
		projectId: nextProjectId,
	}));

	const created = await db.insert(payments).values(paymentRecords).returning();
	return created;
};

export const getPendingPaymentsByProjectService = async (societyId: number) => {
	const pendingPayments = await db
		.select()
		.from(payments)
		.where(eq(payments.societyId, societyId))
		.orderBy(desc(payments.projectId));

	// Group payments by projectId
	const grouped = pendingPayments.reduce((acc, payment) => {
		const projectId = payment.projectId || 0;
		if (!acc[projectId]) {
			acc[projectId] = [];
		}
		acc[projectId].push(payment);
		return acc;
	}, {} as Record<number, typeof pendingPayments>);

	return grouped;
};
