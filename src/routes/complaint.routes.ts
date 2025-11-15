import { Router } from "express";
import {
	createComplaint,
	getComplaintsByUser,
	getComplaintsBySociety,
	updateComplaintStatus,
} from "../controllers/complaint.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody, validateParams } from "../middleware/validateRequest";
import {
	createComplaintSchema,
	updateComplaintStatusSchema,
	idParamSchema,
} from "../types/schemas";

const router = Router();
router.post(
	"/",
	verifyToken,
	validateBody(createComplaintSchema),
	createComplaint
);
router.get("/", verifyToken, getComplaintsByUser);
router.get("/society/all", verifyToken, getComplaintsBySociety);
router.patch(
	"/:id/status",
	verifyToken,
	validateParams(idParamSchema),
	validateBody(updateComplaintStatusSchema),
	updateComplaintStatus
);
export default router;

