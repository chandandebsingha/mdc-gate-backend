import { Router } from "express";
import {
	login,
	register,
	superAdminLogin,
	getMe,
	firebaseLogin,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/super-admin/login", superAdminLogin);
router.post("/firebase", firebaseLogin);
router.get("/me", verifyToken, getMe);
export default router;
