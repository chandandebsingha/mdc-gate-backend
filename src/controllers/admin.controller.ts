import { Request, Response } from "express";
import { z } from "zod";
import { failure, success } from "../utils/response";
import {
	getPendingApprovalsService,
	approveUserService,
	rejectUserService,
} from "../services/admin.service";

export async function getPendingApprovals(req: Request, res: Response) {
	try {
		const data = await getPendingApprovalsService();
		res.json(success(data, "Pending approvals fetched successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to fetch pending approvals", err));
	}
}

const approveSchema = z.object({
	userId: z.number(),
	role: z.enum(["manager", "security"]),
});

export async function approveUser(req: Request, res: Response) {
	try {
		const parsed = approveSchema.safeParse(req.body);
		if (!parsed.success)
			return res
				.status(400)
				.json(failure("Invalid request payload", parsed.error.flatten()));

		const data = await approveUserService(parsed.data.userId, parsed.data.role);
		res.json(success(data, "User approved successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to approve user", err));
	}
}

export async function rejectUser(req: Request, res: Response) {
	try {
		const userId = parseInt(req.params.userId);
		if (isNaN(userId)) {
			return res.status(400).json(failure("Invalid user ID"));
		}

		const data = await rejectUserService(userId);
		res.json(success(data, "User rejected successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to reject user", err));
	}
}
