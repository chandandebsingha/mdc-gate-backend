/**
 * Script to migrate existing payments data to use payment_group table
 * This script:
 * 1. Creates the payment_group table
 * 2. Creates default payment groups for existing project_ids
 * 3. Updates the foreign key constraint
 */

import { db } from "../src/db";
import { payments } from "../src/db/schema/payments";
import { sql } from "drizzle-orm";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

async function migrate() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	try {
		console.log("Starting migration...");

		// Step 1: Get all unique project_ids from payments table
		console.log("1. Fetching existing project IDs from payments table...");
		const result = await pool.query(
			"SELECT DISTINCT project_id FROM payments WHERE project_id IS NOT NULL ORDER BY project_id"
		);
		const existingProjectIds = result.rows.map((r) => r.project_id);
		console.log(
			`Found ${existingProjectIds.length} unique project IDs:`,
			existingProjectIds
		);

		// Step 2: Check if payment_group table exists
		console.log("2. Checking if payment_group table exists...");
		const tableCheck = await pool.query(`
			SELECT EXISTS (
				SELECT FROM information_schema.tables 
				WHERE table_schema = 'public' 
				AND table_name = 'payment_group'
			);
		`);

		if (!tableCheck.rows[0].exists) {
			console.log("3. Creating payment_group table...");
			await pool.query(`
				CREATE TABLE payment_group (
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					description TEXT,
					society_id INTEGER NOT NULL REFERENCES society(id),
					created_by INTEGER NOT NULL REFERENCES users(id),
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
					updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
					status VARCHAR(50) DEFAULT 'active'
				);
			`);
			console.log("✓ payment_group table created");
		} else {
			console.log("✓ payment_group table already exists");
		}

		// Step 3: Get first admin user and first society for default data
		console.log("4. Getting default user and society...");
		const userResult = await pool.query(
			"SELECT id FROM users ORDER BY id LIMIT 1"
		);
		const societyResult = await pool.query(
			"SELECT id FROM society ORDER BY id LIMIT 1"
		);

		if (userResult.rows.length === 0 || societyResult.rows.length === 0) {
			throw new Error("No users or societies found in database");
		}

		const defaultUserId = userResult.rows[0].id;
		const defaultSocietyId = societyResult.rows[0].id;
		console.log(
			`Using user ID: ${defaultUserId}, society ID: ${defaultSocietyId}`
		);

		// Step 4: Create payment groups for existing project_ids
		console.log("5. Creating payment groups for existing project IDs...");
		for (const projectId of existingProjectIds) {
			// Check if group already exists
			const checkGroup = await pool.query(
				"SELECT id FROM payment_group WHERE id = $1",
				[projectId]
			);

			if (checkGroup.rows.length === 0) {
				await pool.query(
					`INSERT INTO payment_group (id, name, description, society_id, created_by, status)
					 VALUES ($1, $2, $3, $4, $5, 'active')`,
					[
						projectId,
						`Payment Group ${projectId}`,
						`Migrated payment group for existing project ID ${projectId}`,
						defaultSocietyId,
						defaultUserId,
					]
				);
				console.log(`✓ Created payment group for project ID ${projectId}`);
			} else {
				console.log(`✓ Payment group ${projectId} already exists`);
			}
		}

		// Step 5: Update sequence to start after highest ID
		if (existingProjectIds.length > 0) {
			const maxId = Math.max(...existingProjectIds);
			console.log(
				`6. Updating payment_group sequence to start at ${maxId + 1}...`
			);
			await pool.query(`SELECT setval('payment_group_id_seq', $1, false)`, [
				maxId + 1,
			]);
			console.log("✓ Sequence updated");
		}

		console.log("\n✅ Migration completed successfully!");
		console.log("You can now run: npm run drizzle:push");
	} catch (error) {
		console.error("❌ Migration failed:", error);
		throw error;
	} finally {
		await pool.end();
	}
}

migrate();
