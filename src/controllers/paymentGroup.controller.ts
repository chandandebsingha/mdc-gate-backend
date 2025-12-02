import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	createPaymentGroupService,
	listPaymentGroupsBySocietyService,
	getPaymentGroupByIdService,
	updatePaymentGroupService,
	deletePaymentGroupService,
	listActivePaymentGroupsBySocietyService,
} from "../services/paymentGroup.service";
import { RequestWithUser } from "../types";
import { db } from "../db";
import { userDetails } from "../db/schema/userDetails";
import { eq } from "drizzle-orm";

export const createPaymentGroup = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const userId = req.user!.userId;

		// Fetch societyId from user details
		const [userDetail] = await db
			.select()
			.from(userDetails)
			.where(eq(userDetails.userId, userId))
			.limit(1);

		const societyId = userDetail?.societyId;

		if (!societyId) {
			return res.status(400).json(failure("Society ID not found"));
		}

		const { name, description, status } = req.body as {
			name: string;
			description?: string;
			status?: string;
		};

		const data = await createPaymentGroupService({
			name,
			description,
			societyId,
			createdBy: userId,
			status: status || "active",
		});

		res.status(201).json(success(data, "Payment group created successfully"));
	} catch (err) {
		res.status(500).json(failure("Failed to create payment group", err));
	}
};

export const listPaymentGroups = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const userId = req.user!.userId;

		// Fetch societyId from user details
		const [userDetail] = await db
			.select()
			.from(userDetails)
			.where(eq(userDetails.userId, userId))
			.limit(1);

		const societyId = userDetail?.societyId;

		if (!societyId) {
			return res.status(400).json(failure("Society ID not found"));
		}

		const activeOnly = req.query.activeOnly === "true";

		const data = activeOnly
			? await listActivePaymentGroupsBySocietyService(societyId)
			: await listPaymentGroupsBySocietyService(societyId);

		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch payment groups", err));
	}
};

export const getPaymentGroup = async (req: RequestWithUser, res: Response) => {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json(failure("Invalid payment group ID"));
		}

		const data = await getPaymentGroupByIdService(id);

		if (!data) {
			return res.status(404).json(failure("Payment group not found"));
		}

		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch payment group", err));
	}
};

export const updatePaymentGroup = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json(failure("Invalid payment group ID"));
		}

		const { name, description, status } = req.body as {
			name?: string;
			description?: string;
			status?: string;
		};

		const data = await updatePaymentGroupService(id, {
			name,
			description,
			status,
		});

		if (!data) {
			return res.status(404).json(failure("Payment group not found"));
		}

		res.json(success(data, "Payment group updated successfully"));
	} catch (err) {
		res.status(500).json(failure("Failed to update payment group", err));
	}
};

export const deletePaymentGroup = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json(failure("Invalid payment group ID"));
		}

		const data = await deletePaymentGroupService(id);

		if (!data) {
			return res.status(404).json(failure("Payment group not found"));
		}

		res.json(success(data, "Payment group deleted successfully"));
	} catch (err) {
		res.status(500).json(failure("Failed to delete payment group", err));
	}
};
