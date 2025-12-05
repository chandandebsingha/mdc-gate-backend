import { Response } from "express";
import { RequestWithUser } from "../types";
import { success, failure } from "../utils/response";
import { listGateLogsService } from "../services/gateLog.service";

export const listGateLogs = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const data = await listGateLogsService(userId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch gate logs", err));
	}
};
