import { Request } from "express";
import { AuthPayload } from "../middleware/authMiddleware";

export interface RequestWithUser extends Request {
	user?: AuthPayload;
}

export type IdParam = { id: string };
