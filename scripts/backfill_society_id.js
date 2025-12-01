require("dotenv").config();
const { Pool } = require("pg");

(async () => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	const client = await pool.connect();
	try {
		console.log("[Backfill] Starting users.society_id backfill");
		await client.query("BEGIN");

		const before = await client.query(
			"SELECT COUNT(*) FROM users WHERE society_id IS NULL"
		);
		console.log(
			`[Backfill] Users missing society_id before: ${before.rows[0].count}`
		);

		const updateSql = `UPDATE users u
      SET society_id = d.society_id
      FROM user_details d
      WHERE d.user_id = u.id
        AND u.society_id IS NULL
        AND d.society_id IS NOT NULL
      RETURNING u.id, u.society_id`;

		const updated = await client.query(updateSql);
		console.log(`[Backfill] Rows updated: ${updated.rowCount}`);

		const after = await client.query(
			"SELECT COUNT(*) FROM users WHERE society_id IS NULL"
		);
		console.log(
			`[Backfill] Users missing society_id after: ${after.rows[0].count}`
		);

		await client.query("COMMIT");
		console.log("[Backfill] Completed successfully");

		if (updated.rowCount > 0) {
			const sample = updated.rows.slice(0, 10);
			console.log("[Backfill] Sample updated rows (first 10):");
			console.table(sample);
		}
	} catch (e) {
		await client.query("ROLLBACK");
		console.error("[Backfill] ERROR:", e);
		process.exit(1);
	} finally {
		client.release();
		await pool.end();
	}
})();
