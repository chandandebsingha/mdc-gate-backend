import { db } from "./db";
import { users } from "./db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { env } from "./config/env";

/**
 * Seed script to create a super admin user
 * Run with: ts-node src/seed.ts
 * or add to package.json scripts: "seed": "ts-node src/seed.ts"
 */

async function seedSuperAdmin() {
	try {
		const superAdminEmail = "superadmin@mygate.com";
		const superAdminPassword = "SuperAdmin123!";

		console.log("🌱 Starting seed process...");
		console.log(`📧 Checking for existing super admin: ${superAdminEmail}`);

		// Check if super admin already exists
		const existing = await db
			.select()
			.from(users)
			.where(eq(users.email, superAdminEmail));

		if (existing.length > 0) {
			console.log("⚠️  Super admin user already exists!");
			console.log(`   Email: ${superAdminEmail}`);
			console.log(`   ID: ${existing[0].id}`);
			console.log(`   Role: ${existing[0].role}`);
			return;
		}

		// Hash the password
		console.log("🔐 Hashing password...");
		const passwordHash = await bcrypt.hash(superAdminPassword, 10);

		// Create super admin user
		console.log("👤 Creating super admin user...");
		const [created] = await db
			.insert(users)
			.values({
				name: "Super Admin",
				email: superAdminEmail,
				phone: "+1234567890",
				role: "super_admin",
				passwordHash,
			})
			.returning();

		console.log("✅ Super admin user created successfully!");
		console.log("\n📋 Login Credentials:");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log(`   Email:    ${superAdminEmail}`);
		console.log(`   Password: ${superAdminPassword}`);
		console.log(`   Role:     ${created.role}`);
		console.log(`   ID:       ${created.id}`);
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("\n⚠️  IMPORTANT: Change the password after first login!");
		console.log("\n🎉 Seed completed successfully!");
	} catch (error) {
		console.error("❌ Error seeding super admin:", error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

// Run the seed function
seedSuperAdmin();
