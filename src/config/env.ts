import dotenv from "dotenv";

dotenv.config();

// Expanded env with explicit anon key and optional service role
type Env = {
	DATABASE_URL: string;
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string; // fallback to legacy SUPABASE_KEY
	SUPABASE_SERVICE_ROLE_KEY?: string;
	JWT_SECRET: string;
	PORT: string;
};

function getEnv(): Env {
	const SUPABASE_ANON_KEY =
		process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "";
	const env: Partial<Env> = {
		DATABASE_URL: process.env.DATABASE_URL || "",
		SUPABASE_URL: process.env.SUPABASE_URL || "",
		SUPABASE_ANON_KEY,
		SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
		JWT_SECRET: process.env.JWT_SECRET || "",
		PORT: process.env.PORT || "4000",
	};

	const required: Array<keyof Env> = [
		"DATABASE_URL",
		"SUPABASE_URL",
		"SUPABASE_ANON_KEY",
		"JWT_SECRET",
		"PORT",
	];

	const missing = required.filter((k) => !env[k]);
	if (missing.length) {
		console.warn(`Missing environment variables: ${missing.join(", ")}`);
	}

	return env as Env;
}

export const env = getEnv();
