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
		const rawUserId = req.user && (req.user.userId as any);
		const userId = Number(rawUserId);
		if (!Number.isInteger(userId)) {
			return res.status(400).json(failure("Invalid user id"));
		}
		console.log('[DEBUG] getMyDetails userId=', userId);
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
		const rawUserId = req.user && (req.user.userId as any);
		const userId = Number(rawUserId);
		if (!Number.isInteger(userId)) {
			return res.status(400).json(failure("Invalid user id"));
		}
		console.log('[DEBUG] upsertMyDetails userId=', userId, 'body=', req.body);
		const updated = await upsertUserDetailsByUserId(userId, req.body);
		res.json(success(updated, "User details saved"));
	} catch (err: any) {
		console.error('[ERROR] upsertMyDetails error:', err);
		// Map Postgres invalid-text-representation to a 400 so UI gets a friendly validation error
		if (err && err.code === "22P02") {
			return res.status(400).json(failure("Invalid numeric value in request", err));
		}
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
