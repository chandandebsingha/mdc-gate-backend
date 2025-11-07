import { Router } from "express";
import { createPayment, listPayments } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";
import { createPaymentSchema } from "../types/schemas";

const router = Router();
router.post("/", verifyToken, validateBody(createPaymentSchema), createPayment);
router.get("/", verifyToken, listPayments);
export default router;
