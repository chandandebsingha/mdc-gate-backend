export async function getSocietyIdService(
	country: string,
	state: string,
	city: string,
	societyName: string
) {
	const [result] = await db
		.select({ id: society.id })
		.from(society)
		.where(
			and(
				eq(society.country, country),
				eq(society.state, state),
				eq(society.city, city),
				eq(society.society, societyName)
			)
		);
	if (!result) {
		throw Object.assign(new Error("Society not found"), { status: 404 });
	}
	return result;
}
import { db } from "../db";
import { society } from "../db/schema/society";
import { eq, and } from "drizzle-orm";

interface CreateSocietyInput {
	country: string;
	state: string;
	city: string;
	society: string;
	buildingName: string;
	block: string;
}

interface UpdateSocietyInput extends Partial<CreateSocietyInput> {}

export async function createSocietyService(input: CreateSocietyInput) {
	const [created] = await db
		.insert(society)
		.values({
			country: input.country,
			state: input.state,
			city: input.city,
			society: input.society,
			buildingName: input.buildingName,
			block: input.block,
		})
		.returning();

	return created;
}

export async function getAllSocietiesService() {
	const societies = await db.select().from(society);
	return societies;
}

export async function getSocietyByIdService(id: number) {
	const [result] = await db.select().from(society).where(eq(society.id, id));

	if (!result) {
		throw Object.assign(new Error("Society not found"), { status: 404 });
	}

	return result;
}

export async function updateSocietyService(
	id: number,
	input: UpdateSocietyInput
) {
	const [updated] = await db
		.update(society)
		.set(input)
		.where(eq(society.id, id))
		.returning();

	if (!updated) {
		throw Object.assign(new Error("Society not found"), { status: 404 });
	}

	return updated;
}

export async function deleteSocietyService(id: number) {
	const [deleted] = await db
		.delete(society)
		.where(eq(society.id, id))
		.returning();

	if (!deleted) {
		throw Object.assign(new Error("Society not found"), { status: 404 });
	}

	return deleted;
}

// Services for dropdown options
export async function getUniqueCountries() {
	const result = await db
		.selectDistinct({ country: society.country })
		.from(society);
	return result.map((r) => r.country);
}

export async function getStatesByCountry(country: string) {
	const result = await db
		.selectDistinct({ state: society.state })
		.from(society)
		.where(eq(society.country, country));
	return result.map((r) => r.state);
}

export async function getCitiesByState(country: string, state: string) {
	const result = await db
		.selectDistinct({ city: society.city })
		.from(society)
		.where(and(eq(society.country, country), eq(society.state, state)));
	return result.map((r) => r.city);
}

export async function getSocietiesByCity(
	country: string,
	state: string,
	city: string
) {
	const result = await db
		.selectDistinct({ society: society.society })
		.from(society)
		.where(
			and(
				eq(society.country, country),
				eq(society.state, state),
				eq(society.city, city)
			)
		);
	return result.map((r) => r.society);
}

export async function getBuildingsBySociety(
	country: string,
	state: string,
	city: string,
	societyName: string
) {
	const result = await db
		.selectDistinct({ buildingName: society.buildingName })
		.from(society)
		.where(
			and(
				eq(society.country, country),
				eq(society.state, state),
				eq(society.city, city),
				eq(society.society, societyName)
			)
		);
	return result.map((r) => r.buildingName);
}

export async function getBlocksByBuilding(
	country: string,
	state: string,
	city: string,
	societyName: string,
	buildingName: string
) {
	const result = await db
		.selectDistinct({ block: society.block })
		.from(society)
		.where(
			and(
				eq(society.country, country),
				eq(society.state, state),
				eq(society.city, city),
				eq(society.society, societyName),
				eq(society.buildingName, buildingName)
			)
		);
	return result.map((r) => r.block);
}
