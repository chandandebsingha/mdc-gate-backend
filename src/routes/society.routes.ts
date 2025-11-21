import { Router } from "express";
import {
	createSociety,
	getAllSocieties,
	getSocietyById,
	updateSociety,
	deleteSociety,
	getCountries,
	getStates,
	getCities,
	getSocieties,
	getBuildings,
	getBlocks,
	getSocietyId,
} from "../controllers/society.controller";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Dropdown options routes (public)
router.get("/dropdowns/countries", getCountries);
router.get("/dropdowns/states", getStates);
router.get("/dropdowns/cities", getCities);
router.get("/dropdowns/societies", getSocieties);
router.get("/dropdowns/buildings", getBuildings);
router.get("/dropdowns/blocks", getBlocks);

// Get societyId by details (public)
router.get("/id", getSocietyId);

// All other society routes require authentication
router.use(verifyToken);

// CRUD routes
router.post("/", createSociety);
router.get("/", getAllSocieties);
router.get("/:id", getSocietyById);
router.put("/:id", updateSociety);
router.delete("/:id", deleteSociety);

export default router;
