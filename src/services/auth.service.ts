import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";

interface RegisterInput {
	name: string;
	email: string;
	password: string;
	phone?: string;
	role?: "resident" | "manager" | "security";
}

interface LoginInput {
	email: string;
	password: string;
}

export async function registerService(input: RegisterInput) {
	const existing = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email));
	if (existing.length) {
		throw Object.assign(new Error("Email already registered"), { status: 409 });
	}
	const passwordHash = await bcrypt.hash(input.password, 10);

	// Determine role and role_status based on registration source
	const role = input.role || "resident";
	const roleStatus =
		role === "manager" || role === "security" ? "requested" : "approved";

	const [created] = await db
		.insert(users)
		.values({
			name: input.name,
			email: input.email,
			phone: input.phone,
			role,
			roleStatus,
			passwordHash,
		})
		.returning();
	const token = signToken({
		userId: created.id,
		email: created.email,
		role: created.role,
	});
	const { passwordHash: _pw, ...safeUser } = created as any;
	return { user: safeUser, token };
}

export async function loginService(input: LoginInput) {
	const rows = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email));
	if (!rows.length)
		throw Object.assign(new Error("Invalid credentials"), { status: 401 });
	const user = rows[0];

	// Check if user role is pending approval
	if ((user as any).roleStatus === "requested") {
		throw Object.assign(
			new Error(
				"Your account is pending approval. Please wait for admin verification."
			),
			{ status: 403 }
		);
	}

	const match = await bcrypt.compare(
		input.password,
		(user as any).passwordHash
	);
	if (!match)
		throw Object.assign(new Error("Invalid credentials"), { status: 401 });
	const token = signToken({
		userId: user.id,
		email: user.email,
		role: user.role,
	});
	const { passwordHash: _pw2, ...safeUser } = user as any;
	return { user: safeUser, token };
}

export async function firebaseLoginService(input: {
	firebaseUid: string;
	email: string;
	name?: string;
}) {
	// Try to find user by email (Firebase can provide email)
	const existing = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email));

	if (existing.length) {
		// User exists, generate token
		const user = existing[0];
		const token = signToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});
		const { passwordHash: _pw, ...safeUser } = user as any;
		return { user: safeUser, token };
	}

	// Create new user from Firebase
	const [created] = await db
		.insert(users)
		.values({
			name: input.name || "Google User",
			email: input.email,
			role: "resident",
			roleStatus: "approved",
			// No password for Firebase-authenticated users
			passwordHash: null as any,
		})
		.returning();

	const token = signToken({
		userId: created.id,
		email: created.email,
		role: created.role,
	});
	const { passwordHash: _pw, ...safeUser } = created as any;
	return { user: safeUser, token };
}

export async function superAdminLoginService(input: LoginInput) {
	const rows = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email));
	if (!rows.length)
		throw Object.assign(new Error("Invalid credentials"), { status: 401 });

	const user = rows[0];

	// Check if user has super_admin role
	if (user.role !== "super_admin") {
		throw Object.assign(
			new Error("Access denied. Super admin privileges required."),
			{ status: 403 }
		);
	}

	const match = await bcrypt.compare(
		input.password,
		(user as any).passwordHash
	);
	if (!match)
		throw Object.assign(new Error("Invalid credentials"), { status: 401 });

	const token = signToken({
		userId: user.id,
		email: user.email,
		role: user.role,
	});
	const { passwordHash: _pw2, ...safeUser } = user as any;
	return { user: safeUser, token };
}
