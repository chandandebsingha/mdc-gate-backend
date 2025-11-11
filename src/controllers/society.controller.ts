import { Request, Response } from "express";
import { z } from "zod";
import { failure, success } from "../utils/response";
import {
	createSocietyService,
	getAllSocietiesService,
	getSocietyByIdService,
	updateSocietyService,
	deleteSocietyService,
	getUniqueCountries,
	getStatesByCountry,
	getCitiesByState,
	getSocietiesByCity,
	getBuildingsBySociety,
	getBlocksByBuilding,
} from "../services/society.service";

const createSocietySchema = z.object({
	country: z.string().min(1, "Country is required").max(100),
	state: z.string().min(1, "State is required").max(100),
	city: z.string().min(1, "City is required").max(100),
	society: z.string().min(1, "Society name is required").max(150),
	buildingName: z.string().min(1, "Building name is required").max(150),
	block: z.string().min(1, "Block is required").max(50),
});

const updateSocietySchema = createSocietySchema.partial();

export async function createSociety(req: Request, res: Response) {
	try {
		const parsed = createSocietySchema.safeParse(req.body);
		if (!parsed.success) {
			return res
				.status(400)
				.json(failure("Invalid request payload", parsed.error.flatten()));
		}

		const society = await createSocietyService(parsed.data);
		res.status(201).json(success(society, "Society created successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to create society", err));
	}
}

export async function getAllSocieties(req: Request, res: Response) {
	try {
		const societies = await getAllSocietiesService();
		res.json(success(societies, "Societies retrieved successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to retrieve societies", err));
	}
}

export async function getSocietyById(req: Request, res: Response) {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json(failure("Invalid society ID"));
		}

		const society = await getSocietyByIdService(id);
		res.json(success(society, "Society retrieved successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to retrieve society", err));
	}
}

export async function updateSociety(req: Request, res: Response) {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json(failure("Invalid society ID"));
		}

		const parsed = updateSocietySchema.safeParse(req.body);
		if (!parsed.success) {
			return res
				.status(400)
				.json(failure("Invalid request payload", parsed.error.flatten()));
		}

		const society = await updateSocietyService(id, parsed.data);
		res.json(success(society, "Society updated successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to update society", err));
	}
}

export async function deleteSociety(req: Request, res: Response) {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json(failure("Invalid society ID"));
		}

		const society = await deleteSocietyService(id);
		res.json(success(society, "Society deleted successfully"));
	} catch (err: any) {
		const status = err?.status || 500;
		res
			.status(status)
			.json(failure(err.message || "Failed to delete society", err));
	}
}

// Dropdown options controllers
export async function getCountries(req: Request, res: Response) {
	try {
		const countries = await getUniqueCountries();
		res.json(success(countries, "Countries retrieved successfully"));
	} catch (err: any) {
		res.status(500).json(failure("Failed to retrieve countries", err));
	}
}

export async function getStates(req: Request, res: Response) {
	try {
		const { country } = req.query;
		if (!country || typeof country !== "string") {
			return res.status(400).json(failure("Country is required"));
		}
		const states = await getStatesByCountry(country);
		res.json(success(states, "States retrieved successfully"));
	} catch (err: any) {
		res.status(500).json(failure("Failed to retrieve states", err));
	}
}

export async function getCities(req: Request, res: Response) {
	try {
		const { country, state } = req.query;
		if (!country || typeof country !== "string") {
			return res.status(400).json(failure("Country is required"));
		}
		if (!state || typeof state !== "string") {
			return res.status(400).json(failure("State is required"));
		}
		const cities = await getCitiesByState(country, state);
		res.json(success(cities, "Cities retrieved successfully"));
	} catch (err: any) {
		res.status(500).json(failure("Failed to retrieve cities", err));
	}
}

export async function getSocieties(req: Request, res: Response) {
	try {
		const { country, state, city } = req.query;
		if (!country || typeof country !== "string") {
			return res.status(400).json(failure("Country is required"));
		}
		if (!state || typeof state !== "string") {
			return res.status(400).json(failure("State is required"));
		}
		if (!city || typeof city !== "string") {
			return res.status(400).json(failure("City is required"));
		}
		const societies = await getSocietiesByCity(country, state, city);
		res.json(success(societies, "Societies retrieved successfully"));
	} catch (err: any) {
		res.status(500).json(failure("Failed to retrieve societies", err));
	}
}

export async function getBuildings(req: Request, res: Response) {
	try {
		const { country, state, city, society } = req.query;
		if (!country || typeof country !== "string") {
			return res.status(400).json(failure("Country is required"));
		}
		if (!state || typeof state !== "string") {
			return res.status(400).json(failure("State is required"));
		}
		if (!city || typeof city !== "string") {
			return res.status(400).json(failure("City is required"));
		}
		if (!society || typeof society !== "string") {
			return res.status(400).json(failure("Society is required"));
		}
		const buildings = await getBuildingsBySociety(
			country,
			state,
			city,
			society
		);
		res.json(success(buildings, "Buildings retrieved successfully"));
	} catch (err: any) {
		res.status(500).json(failure("Failed to retrieve buildings", err));
	}
}

export async function getBlocks(req: Request, res: Response) {
	try {
		const { country, state, city, society, buildingName } = req.query;
		if (!country || typeof country !== "string") {
			return res.status(400).json(failure("Country is required"));
		}
		if (!state || typeof state !== "string") {
			return res.status(400).json(failure("State is required"));
		}
		if (!city || typeof city !== "string") {
			return res.status(400).json(failure("City is required"));
		}
		if (!society || typeof society !== "string") {
			return res.status(400).json(failure("Society is required"));
		}
		if (!buildingName || typeof buildingName !== "string") {
			return res.status(400).json(failure("Building name is required"));
		}
		const blocks = await getBlocksByBuilding(
			country,
			state,
			city,
			society,
			buildingName
		);
		res.json(success(blocks, "Blocks retrieved successfully"));
	} catch (err: any) {
		res.status(500).json(failure("Failed to retrieve blocks", err));
	}
}
