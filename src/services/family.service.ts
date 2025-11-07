import { db } from "../db";
import { familyMembers, NewFamilyMember } from "../db/schema/familyMembers";
import { eq } from "drizzle-orm";

export const addFamilyMemberService = async (
	payload: Omit<NewFamilyMember, "id">
) => {
	const [created] = await db.insert(familyMembers).values(payload).returning();
	return created;
};

export const listFamilyMembersService = async (userId: number) => {
	return db
		.select()
		.from(familyMembers)
		.where(eq(familyMembers.userId, userId));
};
