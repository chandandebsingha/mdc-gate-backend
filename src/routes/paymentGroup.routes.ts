import { Router } from "express";
import {
	createPaymentGroup,
	listPaymentGroups,
	getPaymentGroup,
	updatePaymentGroup,
	deletePaymentGroup,
} from "../controllers/paymentGroup.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, createPaymentGroup);
router.get("/", verifyToken, listPaymentGroups);
router.get("/:id", verifyToken, getPaymentGroup);
router.put("/:id", verifyToken, updatePaymentGroup);
router.delete("/:id", verifyToken, deletePaymentGroup);

export default router;
