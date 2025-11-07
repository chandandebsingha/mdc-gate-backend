import { Router } from "express";
import {
	addFamilyMember,
	listFamilyMembers,
} from "../controllers/family.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";
import { addFamilyMemberSchema } from "../types/schemas";

const router = Router();
router.post(
	"/",
	verifyToken,
	validateBody(addFamilyMemberSchema),
	addFamilyMember
);
router.get("/", verifyToken, listFamilyMembers);
export default router;
