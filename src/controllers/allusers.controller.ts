import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema/users";
import { userDetails } from "../db/schema/userDetails";
import { eq } from "drizzle-orm";
import { failure, success } from "../utils/response";

export async function getAllUsersOfSociety(req: Request, res: Response) {
	try {
		// Get societyId from user token or query
		const societyId = req.user?.societyId || req.query.societyId;
		if (!societyId) {
			return res.status(400).json(failure("Missing societyId"));
		}
		// Join users and userDetails on userId, filter by societyId
		const rows = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				flat: userDetails.block,
				building: userDetails.buildingName,
				role: users.role,
			})
			.from(users)
			.innerJoin(userDetails, eq(users.id, userDetails.userId))
			.where(eq(userDetails.societyId, Number(societyId)));
		return res.json(success(rows));
	} catch (err) {
		return res.status(500).json(failure("Failed to fetch users", err));
	}
}
