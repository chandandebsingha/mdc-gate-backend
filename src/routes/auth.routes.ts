import { Router } from "express";
import {
	login,
	register,
	superAdminLogin,
} from "../controllers/auth.controller";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/super-admin/login", superAdminLogin);
export default router;
