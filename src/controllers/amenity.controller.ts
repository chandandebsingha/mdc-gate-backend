import { Response } from "express";
import { success, failure } from "../utils/response";
import {
	listAmenitiesService,
	bookAmenityService,
} from "../services/amenity.service";
import { RequestWithUser } from "../types";

export const listAmenities = async (_req: RequestWithUser, res: Response) => {
	try {
		const data = await listAmenitiesService();
		res.json(success(data));
	} catch (err) {
		res.status(500).json(failure("Failed to list amenities", err));
	}
};

export const bookAmenity = async (req: RequestWithUser, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const updated = await bookAmenityService(Number(id));
		if (!updated) return res.status(404).json(failure("Amenity not found"));
		res.json(success(updated, "Amenity booked"));
	} catch (err) {
		res.status(500).json(failure("Failed to book amenity", err));
	}
};
