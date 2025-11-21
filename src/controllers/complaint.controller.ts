import { Request, Response } from "express";
import { success, failure } from "../utils/response";
import {
	createComplaintService,
	getComplaintsByUserService,
	getComplaintsBySocietyService,
	updateComplaintStatusService,
} from "../services/complaint.service";
import { RequestWithUser } from "../types";
import { db } from "../db";
import { userDetails } from "../db/schema/userDetails";
import { eq } from "drizzle-orm";

export const createComplaint = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const {
			category,
			subcategory,
			requestType,
			isUrgent,
			description,
			imageUrl,
		} = req.body as {
			category: string;
			subcategory: string;
			requestType: string;
			isUrgent?: boolean;
			description: string;
			imageUrl?: string;
		};

		// Fetch userDetails to get societyId
		const userDetailsRow = await db
			.select()
			.from(userDetails)
			.where(eq(userDetails.userId, userId))
			.limit(1);
		if (!userDetailsRow || userDetailsRow.length === 0) {
			return res
				.status(400)
				.json(failure("", "User details not found for societyId"));
		}
		const societyId = userDetailsRow[0].societyId;
		if (!societyId) {
			return res
				.status(400)
				.json(failure("", "societyId not found in user details"));
		}
		const data = await createComplaintService({
			userId,
			category,
			subcategory,
			requestType,
			isUrgent: isUrgent ? 1 : 0,
			description,
			imageUrl,
			societyId,
		});
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

export const getComplaintsBySociety = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const managerId = req.user!.userId;
		const data = await getComplaintsBySocietyService(managerId);
		res.json(success(data));
	} catch (err: any) {
		console.error("[getComplaintsBySociety] Error:", err);
		res
			.status(500)
			.json(failure("Failed to fetch society complaints", err?.message || err));
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
