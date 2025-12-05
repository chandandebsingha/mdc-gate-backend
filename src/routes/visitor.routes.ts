import { Router } from "express";
import {
	approveVisitor,
	listVisitors,
	giveEntry,
} from "../controllers/visitor.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody, validateParams } from "../middleware/validateRequest";
import { approveVisitorSchema, idParamSchema } from "../types/schemas";

const router = Router();
router.post(
	"/",
	verifyToken,
	validateBody(approveVisitorSchema),
	approveVisitor
);
router.get("/", verifyToken, listVisitors);
router.post(
	"/:id/entry",
	verifyToken,
	validateParams(idParamSchema),
	giveEntry
);
export default router;
