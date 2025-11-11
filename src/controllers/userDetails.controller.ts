import { Response } from "express";
import { success, failure } from "../utils/response";
import { RequestWithUser } from "../types";
import {
	getUserDetailsByUserId,
	upsertUserDetailsByUserId,
} from "../services/userDetails.service";
import { AuthorityValues, OccupancyStatusValues } from "../utils/constants";

export async function getMyDetails(req: RequestWithUser, res: Response) {
	try {
		const userId = req.user!.userId;
		const details = await getUserDetailsByUserId(userId);
		if (!details)
			return res.status(404).json(failure("User details not found"));
		res.json(success(details));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch user details", err));
	}
}

export async function upsertMyDetails(req: RequestWithUser, res: Response) {
	try {
		const userId = req.user!.userId;
		const updated = await upsertUserDetailsByUserId(userId, req.body);
		res.json(success(updated, "User details saved"));
	} catch (err) {
		res.status(500).json(failure("Failed to save user details", err));
	}
}

export async function getFormOptions(req: RequestWithUser, res: Response) {
	try {
		const options = {
			authority: AuthorityValues,
			occupancyStatus: OccupancyStatusValues,
		};
		res.json(success(options, "Form options retrieved"));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch form options", err));
	}
}
