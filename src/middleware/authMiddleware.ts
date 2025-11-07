import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { failure } from "../utils/response";

export interface AuthPayload {
	userId: number;
	email?: string;
	role?: string;
}

export interface RequestWithUser extends Request {
	user?: AuthPayload;
}

export const verifyToken = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return res.status(401).json(failure("Unauthorized"));
		}
		const token = authHeader.replace("Bearer ", "");
		const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json(failure("Unauthorized", err));
	}
};
