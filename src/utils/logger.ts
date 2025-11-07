/* Simple wrapper; can be replaced with pino/winston later */
export const logger = {
	info: (...args: unknown[]) => console.log("[INFO]", ...args),
	warn: (...args: unknown[]) => console.warn("[WARN]", ...args),
	error: (...args: unknown[]) => console.error("[ERROR]", ...args),
};
