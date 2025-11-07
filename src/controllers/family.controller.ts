import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	addFamilyMemberService,
	listFamilyMembersService,
} from "../services/family.service";
import { RequestWithUser } from "../types";

export const addFamilyMember = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.user!.userId;
		const { name, relation, phone } = req.body as {
			name: string;
			relation: string;
			phone?: string;
		};
		const data = await addFamilyMemberService({
			userId,
			name,
			relation,
			phone,
		});
		res.status(201).json(success(data, "Family member added"));
	} catch (err) {
		res.status(500).json(failure("Failed to add family member", err));
	}
};

export const listFamilyMembers = async (
	req: RequestWithUser,
	res: Response
) => {
	try {
		const userId = req.user!.userId;
		const data = await listFamilyMembersService(userId);
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to fetch family members", err));
	}
};
