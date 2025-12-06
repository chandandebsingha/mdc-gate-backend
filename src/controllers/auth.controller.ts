import { Request, Response } from "express";
import { z } from "zod";
import { failure, success } from "../utils/response";
import {
	loginService,
	registerService,
	superAdminLoginService,
	firebaseLoginService,
} from "../services/auth.service";
import { getUserDetailsByUserId } from "../services/userDetails.service";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if credentials exist
let firebaseApp: admin.app.App | null = null;
try {
	const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
	if (serviceAccountJson) {
		const serviceAccount = JSON.parse(serviceAccountJson);
		firebaseApp = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	}
} catch (err) {
	console.warn(
		"Firebase Admin SDK not initialized (expected if not configured):",
		err
	);
}

// GET /api/auth/me
export async function getMe(req: any, res: Response) {
	try {
		const userId = req.user?.userId;
		if (!userId) return res.status(401).json(failure("Unauthorized"));
		const user = {
			id: userId,
			email: req.user?.email,
			role: req.user?.role,
		};

		const details = await getUserDetailsByUserId(userId);

		// Return all fields for robust frontend detection
		res.json(
			success({
				...user,
				...details,
				details,
			})
		);
	} catch (err: any) {
		res.status(500).json(failure("Failed to fetch profile", err));
	}
}

const registerSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
	phone: z.string().optional(),
	role: z.enum(["resident", "manager", "security"]).optional(),
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

export async function firebaseLogin(req: Request, res: Response) {
	try {
		if (!firebaseApp) {
			return res
				.status(503)
				.json(failure("Firebase is not configured on this server"));
		}

		const { idToken } = req.body;
		if (!idToken) {
			return res.status(400).json(failure("Missing idToken"));
		}

		// Verify the Firebase ID token
		const decodedToken = await admin.auth(firebaseApp).verifyIdToken(idToken);
		const { uid, email, name } = decodedToken;

		// Exchange Firebase token for app session token
		const data = await firebaseLoginService({
			firebaseUid: uid,
			email: email || "",
			name: name,
		});

		res.json(success(data, "Firebase login successful"));
	} catch (err: any) {
		console.error("Firebase login error:", err);
		const status = err?.code === "auth/argument-error" ? 401 : 500;
		res
			.status(status)
			.json(failure(err.message || "Firebase authentication failed", err));
	}
}
