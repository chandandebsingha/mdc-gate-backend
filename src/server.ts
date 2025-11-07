import { env } from "./config/env";
import app from "./app";
import { logger } from "./utils/logger";
import { testDbConnection } from "./db";

const port = Number(env.PORT || 4000);

async function start() {
	try {
		await testDbConnection();
	} catch (err) {
		logger.error("Database connection failed:", err);
		// Continue to start server or exit; here we continue but log loudly
	}

	app.listen(port, () => {
		logger.info(`Server running on http://localhost:${port}`);
	});
}

start();
