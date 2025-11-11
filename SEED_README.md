# Database Seeding - Super Admin User

## Overview

This seed script creates a super admin user in the database with elevated privileges.

## Super Admin Credentials

After running the seed script, use these credentials to log in:

- **Email**: `superadmin@mygate.com`
- **Password**: `SuperAdmin123!`
- **Role**: `super_admin`

## How to Run

### Method 1: Using npm script (Recommended)

```bash
cd my-gate-backend
npm run seed
```

### Method 2: Using ts-node directly

```bash
cd my-gate-backend
npx ts-node src/seed.ts
```

### Method 3: After building

```bash
cd my-gate-backend
npm run build
node dist/seed.js
```

## Expected Output

When the seed runs successfully, you'll see:

```
🌱 Starting seed process...
📧 Checking for existing super admin: superadmin@mygate.com
🔐 Hashing password...
👤 Creating super admin user...
✅ Super admin user created successfully!

📋 Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    superadmin@mygate.com
   Password: SuperAdmin123!
   Role:     super_admin
   ID:       1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANT: Change the password after first login!

🎉 Seed completed successfully!
```

## If User Already Exists

If you run the seed script multiple times, it will detect the existing user:

```
🌱 Starting seed process...
📧 Checking for existing super admin: superadmin@mygate.com
⚠️  Super admin user already exists!
   Email: superadmin@mygate.com
   ID: 1
   Role: super_admin
```

## Prerequisites

1. **Database Connection**: Ensure your database is running and accessible
2. **Environment Variables**: Make sure `.env` file is configured:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```
3. **Database Schema**: Run migrations before seeding:
   ```bash
   npm run drizzle:push
   ```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS**:

1. **Change Default Password**: The default password (`SuperAdmin123!`) should be changed immediately after first login
2. **Environment-Specific Credentials**: Consider using different credentials for different environments (dev, staging, production)
3. **Secure Storage**: Never commit actual production credentials to version control
4. **Password Strength**: The seed password is strong but should still be changed in production

## Customizing the Seed

To change the default super admin credentials, edit `src/seed.ts`:

```typescript
const superAdminEmail = "your-email@example.com";
const superAdminPassword = "YourSecurePassword123!";
```

You can also modify other fields:

- `name`: Display name
- `phone`: Contact number
- `role`: User role (keep as `super_admin`)

## Troubleshooting

### Error: "Cannot connect to database"

- Verify `DATABASE_URL` in `.env`
- Ensure database server is running
- Check network connectivity

### Error: "Table 'users' does not exist"

- Run migrations first: `npm run drizzle:push`
- Verify database schema is up to date

### Error: "Email already registered"

- User already exists (this is normal on subsequent runs)
- To reset, delete the user from database first:
  ```sql
  DELETE FROM users WHERE email = 'superadmin@mygate.com';
  ```

## Testing Login

After seeding, test the super admin login:

### Using curl:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@mygate.com",
    "password": "SuperAdmin123!"
  }'
```

### Using the Super Admin Frontend:

1. Navigate to `http://localhost:3000`
2. Enter email: `superadmin@mygate.com`
3. Enter password: `SuperAdmin123!`
4. Click "Sign in"

## Role-Based Access

The `super_admin` role provides the highest level of access. Consider implementing role checks in your middleware:

```typescript
// Example: Require super_admin role
export function requireSuperAdmin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.user?.role !== "super_admin") {
		return res.status(403).json({ error: "Super admin access required" });
	}
	next();
}
```

## Next Steps

After creating the super admin user:

1. ✅ Log in to the super admin panel
2. ✅ Change the default password
3. ✅ Create additional admin users as needed
4. ✅ Configure role-based permissions
5. ✅ Set up audit logging for admin actions
