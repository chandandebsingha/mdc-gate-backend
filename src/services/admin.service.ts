import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

export async function getPendingApprovalsService() {
	const pendingUsers = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			phone: users.phone,
			role: users.role,
			createdAt: users.createdAt,
		})
		.from(users)
		.where(eq(users.roleStatus, "requested"));

	return pendingUsers;
}

export async function approveUserService(userId: number, approvedRole: string) {
	// Update user role_status to approved
	const [updated] = await db
		.update(users)
		.set({
			role: approvedRole,
			roleStatus: "approved",
		})
		.where(eq(users.id, userId))
		.returning();

	if (!updated) {
		throw Object.assign(new Error("User not found"), { status: 404 });
	}

	return { user: updated };
}

export async function rejectUserService(userId: number) {
	// Delete the user record (reject registration)
	const [deleted] = await db
		.delete(users)
		.where(eq(users.id, userId))
		.returning();

	if (!deleted) {
		throw Object.assign(new Error("User not found"), { status: 404 });
	}

	return { message: "User registration rejected" };
}
