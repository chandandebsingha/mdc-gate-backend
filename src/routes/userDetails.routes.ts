import { Router } from "express";
import {
	getMyDetails,
	upsertMyDetails,
	getFormOptions,
} from "../controllers/userDetails.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";
import { upsertUserDetailsSchema } from "../types/schemas";

const router = Router();
router.get("/myprofile", verifyToken, getMyDetails);
router.put(
	"/myprofile",
	verifyToken,
	validateBody(upsertUserDetailsSchema),
	upsertMyDetails
);
router.get("/form-options", verifyToken, getFormOptions);
export default router;
