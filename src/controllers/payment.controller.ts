import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	createPaymentService,
	listPaymentsByUserService,
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
