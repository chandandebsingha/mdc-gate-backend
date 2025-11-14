import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
	getPendingApprovals,
	approveUser,
	rejectUser,
} from "../controllers/admin.controller";

const router = Router();

// All admin routes require authentication
router.use(verifyToken);

// Get all pending approval requests
router.get("/pending-approvals", getPendingApprovals);

// Approve a user (update role and roleStatus)
router.post("/approve-user", approveUser);

// Reject a user (delete from database)
router.delete("/reject-user/:userId", rejectUser);

export default router;
