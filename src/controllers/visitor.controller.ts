import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	approveVisitorService,
	listVisitorsService,
} from "../services/visitor.service";
import { RequestWithUser } from "../types";

export const approveVisitor = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const { visitorName, vehicleNumber, date } = req.body as {
			visitorName: string;
			vehicleNumber?: string;
			date: string;
		};
		const data = await approveVisitorService({
			userId,
			visitorName,
			vehicleNumber,
			date: new Date(date) as any,
		});
		res.status(201).json(success(data, "Visitor approved"));
	} catch (err) {
		res.status(500).json(failure("Failed to approve visitor", err));
	}
};

export const listVisitors = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const data = await listVisitorsService(userId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch visitors", err));
	}
};
