import { Router } from "express";
import {
	approveVisitor,
	listVisitors,
} from "../controllers/visitor.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";
import { approveVisitorSchema } from "../types/schemas";

const router = Router();
router.post(
	"/",
	verifyToken,
	validateBody(approveVisitorSchema),
	approveVisitor
);
router.get("/", verifyToken, listVisitors);
export default router;
