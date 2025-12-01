import { Router } from "express";
import { getAllUsersOfSociety } from "../controllers/allusers.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();
router.get("/", verifyToken, getAllUsersOfSociety);
export default router;
