import type { Config } from "drizzle-kit";
import { env } from "./env";

// Drizzle config used by drizzle-kit CLI for migrations
export default {
	schema: "./src/db/schema",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config;
