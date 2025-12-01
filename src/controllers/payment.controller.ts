import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	createPaymentService,
	listPaymentsByUserService,
	createBulkPaymentRequestsService,
	getPendingPaymentsByProjectService,
} from "../services/payment.service";
import { RequestWithUser } from "../types";

export const createPayment = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const { amount, paymentType } = req.body as {
			amount: string;
			paymentType: string;
		};
		const data = await createPaymentService({ userId, amount, paymentType });
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
		const { requests } = req.body as {
			requests: Array<{
				userId: number;
				societyId: number;
				amount: number;
				description: string;
				status: string;
				paymentType: string;
			}>;
		};
		const data = await createBulkPaymentRequestsService({ requests });

		res
			.status(201)
			.json(success(data, "Payment requests created successfully"));
	} catch (err) {
		res.status(500).json(failure("Failed to create payment requests", err));
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
