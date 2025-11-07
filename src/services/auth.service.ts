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
	const [created] = await db
		.insert(users)
		.values({
			name: input.name,
			email: input.email,
			phone: input.phone,
			role: "resident",
			passwordHash,
		})
		.returning();
	const token = signToken({
		userId: created.id,
		email: created.email,
		role: created.role,
	});
	return { user: created, token };
}

export async function loginService(input: LoginInput) {
	const rows = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email));
	if (!rows.length)
		throw Object.assign(new Error("Invalid credentials"), { status: 401 });
	const user = rows[0];
	const match = await bcrypt.compare(input.password, user.passwordHash);
	if (!match)
		throw Object.assign(new Error("Invalid credentials"), { status: 401 });
	const token = signToken({
		userId: user.id,
		email: user.email,
		role: user.role,
	});
	return { user, token };
}
