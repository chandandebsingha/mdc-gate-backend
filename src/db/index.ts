import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const pool = new Pool({ connectionString: env.DATABASE_URL });
pool.on("error", (err) => {
	logger.error("DB pool error:", err);
});
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
