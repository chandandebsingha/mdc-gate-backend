import { Request, Response } from "express";
import { z } from "zod";
import { failure, success } from "../utils/response";
import {
	loginService,
	registerService,
	superAdminLoginService,
} from "../services/auth.service";

const registerSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
	phone: z.string().optional(),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
	try {
		const parsed = registerSchema.safeParse(req.body);
		if (!parsed.success)
			return res
				.status(400)
				.json(failure("Invalid request payload", parsed.error.flatten()));
		const data = await registerService(parsed.data);
		res.status(201).json(success(data, "Registered successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res.status(status).json(failure(err.message || "Registration failed", err));
	}
}

export async function login(req: Request, res: Response) {
	try {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success)
			return res
				.status(400)
				.json(failure("Invalid request payload", parsed.error.flatten()));
		const data = await loginService(parsed.data);
		res.json(success(data, "Login successful"));
	} catch (err: any) {
		const status = err?.status || 401;
		res.status(status).json(failure(err.message || "Invalid credentials", err));
	}
}

export async function superAdminLogin(req: Request, res: Response) {
	try {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success)
			return res
				.status(400)
				.json(failure("Invalid request payload", parsed.error.flatten()));
		const data = await superAdminLoginService(parsed.data);
		res.json(success(data, "Super admin login successful"));
	} catch (err: any) {
		const status = err?.status || 401;
		res.status(status).json(failure(err.message || "Access denied", err));
	}
}
