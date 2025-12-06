import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	createPaymentService,
	listPaymentsByUserService,
	createBulkPaymentRequestsService,
	getPendingPaymentsByProjectService,
	getPaymentsByGroupIdService,
} from "../services/payment.service";
import { RequestWithUser } from "../types";

export const createPayment = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const { amount, paymentType, paymentGroupId: rawGroupId } = req.body as {
			amount: string;
			paymentType: string;
			paymentGroupId?: number | string;
		};

		const societyId = req.user?.societyId;
		const paymentGroupId = rawGroupId !== undefined ? Number(rawGroupId) : undefined;

		if (!societyId) {
			return res.status(400).json(failure("Society ID not found on user"));
		}

		if (!paymentGroupId || Number.isNaN(paymentGroupId)) {
			return res.status(400).json(failure("paymentGroupId is required and must be a number"));
		}

		const data = await createPaymentService({
			userId,
			societyId,
			amount,
			paymentType,
			paymentGroupId,
		});
		res.status(201).json(success(data, "Payment initiated"));
	} catch (err) {
		res.status(500).json(failure("Failed to initiate payment", err));
	}
};

export const listPayments = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const data = await listPaymentsByUserService(userId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch payments", err));
	}
};

export const createPaymentRequests = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const { requests, projectId, projectName, projectDescription } =
			req.body as {
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
			};

		if (!req.user?.userId) {
			return res.status(401).json(failure("User not authenticated"));
		}

		if (!requests || requests.length === 0) {
			return res.status(400).json(failure("No payment requests provided"));
		}

		const result = await createBulkPaymentRequestsService({
			requests,
			projectId,
			projectName,
			projectDescription,
			createdBy: req.user.userId,
		});

		res.status(201).json(
			success(
				{
					payments: result.payments,
					paymentGroupId: result.projectId,
					projectId: result.projectId, // Keep both for compatibility
					totalPayments: result.payments.length,
				},
				"Payment requests created successfully"
			)
		);
	} catch (err: any) {
		console.error("Error creating payment requests:", err);
		res
			.status(500)
			.json(failure("Failed to create payment requests", err.message || err));
	}
};

export const getPendingPaymentsByProject = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const societyId = req.user?.societyId;
		if (!societyId) {
			return res.status(400).json(failure("Society ID not found"));
		}
		const data = await getPendingPaymentsByProjectService(societyId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch pending payments", err));
	}
};

export const getPaymentsByGroup = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const groupId = parseInt(req.params.groupId);
		if (isNaN(groupId)) {
			return res.status(400).json(failure("Invalid payment group ID"));
		}
		const data = await getPaymentsByGroupIdService(groupId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch payments for group", err));
	}
};
