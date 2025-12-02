import { db } from "../db";
import { payments, NewPayment } from "../db/schema/payments";
import { paymentGroup } from "../db/schema/paymentgroup";
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
	projectId?: number;
	projectName?: string;
	projectDescription?: string;
	createdBy: number;
}) => {
	try {
		let projectIdToUse = payload.projectId;

		// If no projectId provided, create a new payment group
		if (!projectIdToUse) {
			const firstRequest = payload.requests[0];
			if (!firstRequest) {
				throw new Error("No payment requests provided");
			}

			const groupName =
				payload.projectName ||
				`Payment Group - ${new Date().toLocaleDateString()}`;
			const groupDescription =
				payload.projectDescription ||
				payload.requests[0]?.description ||
				"Auto-generated payment group";

			console.log("Creating payment group:", {
				name: groupName,
				description: groupDescription,
				societyId: firstRequest.societyId,
				createdBy: payload.createdBy,
			});

			const [newGroup] = await db
				.insert(paymentGroup)
				.values({
					name: groupName,
					description: groupDescription,
					societyId: firstRequest.societyId,
					createdBy: payload.createdBy,
					status: "active",
				})
				.returning();

			if (!newGroup) {
				throw new Error("Failed to create payment group");
			}

			projectIdToUse = newGroup.id;
			console.log("Created payment group with ID:", projectIdToUse);
		}

		const paymentRecords = payload.requests.map((req) => ({
			userId: req.userId,
			societyId: req.societyId,
			amount: req.amount.toString(),
			paymentType: req.paymentType,
			description: req.description,
			status: req.status,
			paymentGroupId: projectIdToUse!,
		}));

		console.log("Creating payments:", paymentRecords.length, "records");

		const created = await db
			.insert(payments)
			.values(paymentRecords)
			.returning();

		console.log("Successfully created", created.length, "payments");

		return { payments: created, projectId: projectIdToUse };
	} catch (error) {
		console.error("Error in createBulkPaymentRequestsService:", error);
		throw error;
	}
};

export const getPendingPaymentsByProjectService = async (societyId: number) => {
	const pendingPayments = await db
		.select()
		.from(payments)
		.where(eq(payments.societyId, societyId))
		.orderBy(desc(payments.paymentGroupId));

	// Group payments by paymentGroupId
	const grouped = pendingPayments.reduce((acc, payment) => {
		const projectId = payment.paymentGroupId || 0;
		if (!acc[projectId]) {
			acc[projectId] = [];
		}
		acc[projectId].push(payment);
		return acc;
	}, {} as Record<number, typeof pendingPayments>);

	return grouped;
};

export const getPaymentsByGroupIdService = async (paymentGroupId: number) => {
	return db
		.select()
		.from(payments)
		.where(eq(payments.paymentGroupId, paymentGroupId))
		.orderBy(desc(payments.createdAt));
};
