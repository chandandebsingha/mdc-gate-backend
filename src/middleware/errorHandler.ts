import { Request, Response, NextFunction } from "express";
import { failure } from "../utils/response";
import { logger } from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	logger.error(err);
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";
	res.status(status).json(failure(message));
}
