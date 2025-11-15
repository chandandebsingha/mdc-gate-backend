import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const pool = new Pool({ connectionString: env.DATABASE_URL });
pool.on("error", (err) => {
	logger.error("DB pool error:", err);
});
// Instrument pool.query to log SQL and params for debugging invalid param errors
const originalQuery = pool.query.bind(pool) as any;
pool.query = function (text: any, params?: any, callback?: any) {
	try {
		logger.info('[DB QUERY]', typeof text === 'string' ? text : text && text.text ? text.text : text, params);
	} catch (e) {
		// ignore logging errors
	}
	return originalQuery(text, params, callback);
} as any;

export const db = drizzle(pool);
export async function testDbConnection(): Promise<void> {
	const client = await pool.connect();
	try {
		await client.query("SELECT 1");
		logger.info("Database connected");
	} finally {
		client.release();
	}
}

export * from "./schema/users";
export * from "./schema/complaints";
export * from "./schema/amenities";
export * from "./schema/payments";
export * from "./schema/visitors";
export * from "./schema/familyMembers";
export * from "./schema/userDetails";
export * from "./schema/society";
