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
		const {
			visitorName,
			visitorPhone,
			visitorType,
			vehicleNumber,
			date,
			timeOfVisit,
			visitEndTime,
			note,
			otp,
		} = req.body as {
			visitorName: string;
			visitorPhone: string;
			visitorType?: string;
			vehicleNumber?: string;
			date: string;
			timeOfVisit?: string;
			visitEndTime?: string;
			note?: string;
			otp?: string;
		};
		const visitDate = new Date(date);
		const payload = {
			userId,
			visitorName,
			visitorPhone,
			visitorType: visitorType || "guest",
			vehicleNumber,
			dateOfVisit: visitDate.toISOString().split("T")[0] as any,
			timeOfVisit:
				timeOfVisit ||
				visitDate.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			visitEndTime,
			note,
			otp,
		};
		console.log(
			"Creating visitor with payload:",
			JSON.stringify(payload, null, 2)
		);
		const data = await approveVisitorService(payload);
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
