import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { failure } from "../utils/response";

export const validateBody =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res
				.status(400)
				.json(failure("Invalid request payload", result.error.flatten()));
		}
		req.body = result.data;
		next();
	};

export const validateParams =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.params);
		if (!result.success) {
			return res
				.status(400)
				.json(failure("Invalid request params", result.error.flatten()));
		}
		req.params = result.data as any;
		next();
	};

export const validateQuery =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.query);
		if (!result.success) {
			return res
				.status(400)
				.json(failure("Invalid request query", result.error.flatten()));
		}
		req.query = result.data as any;
		next();
	};
