import { Router } from "express";
import {
	createPayment,
	listPayments,
	createPaymentRequests,
	getPendingPaymentsByProject,
} from "../controllers/payment.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";
import {
	createPaymentSchema,
	createPaymentRequestSchema,
} from "../types/schemas";

const router = Router();
router.post(
	"/",
	verifyToken,
	validateBody(createPaymentRequestSchema),
	createPaymentRequests
);
router.post(
	"/single",
	verifyToken,
	validateBody(createPaymentSchema),
	createPayment
);
router.get("/", verifyToken, listPayments);
router.get("/pending-by-project", verifyToken, getPendingPaymentsByProject);
export default router;
