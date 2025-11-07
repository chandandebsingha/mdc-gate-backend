import { Router } from "express";
import { listAmenities, bookAmenity } from "../controllers/amenity.controller";
import { verifyToken } from "../middleware/authMiddleware";
import { validateParams } from "../middleware/validateRequest";
import { idParamSchema } from "../types/schemas";

const router = Router();
router.get("/", verifyToken, listAmenities);
router.post(
	"/:id/book",
	verifyToken,
	validateParams(idParamSchema),
	bookAmenity
);
export default router;
