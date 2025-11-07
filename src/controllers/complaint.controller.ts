import { Request, Response } from "express";
import { success, failure } from "../utils/response";
import {
	createComplaintService,
	getComplaintsByUserService,
	updateComplaintStatusService,
} from "../services/complaint.service";
import { RequestWithUser } from "../types";

export const createComplaint = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const { title, description } = req.body as {
			title: string;
			description: string;
		};
		const data = await createComplaintService({ userId, title, description });
		res.status(201).json(success(data, "Complaint created"));
	} catch (err) {
		res.status(500).json(failure("Failed to create complaint", err));
	}
};

export const getComplaintsByUser = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const userId = req.user!.userId;
		const data = await getComplaintsByUserService(userId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch complaints", err));
	}
};

export const updateComplaintStatus = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const userId = req.user?.userId; // allow admin to update without matching userId (could add role check)
		const { id } = req.params as { id: string };
		const { status } = req.body as { status: string };
		const updated = await updateComplaintStatusService(
			Number(id),
			status,
			userId
		);
		if (!updated) return res.status(404).json(failure("Complaint not found"));
		res.json(success(updated, "Status updated"));
	} catch (err) {
		res.status(500).json(failure("Failed to update complaint", err));
	}
};
