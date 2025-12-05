import { Router } from "express";
import { listGateLogs } from "../controllers/gateLog.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();
router.get("/", verifyToken, listGateLogs);

export default router;
