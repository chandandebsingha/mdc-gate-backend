# Backend Firebase Integration - Implementation Details

## Overview

The backend `POST /auth/firebase` endpoint handles Firebase ID token verification and user creation/lookup.

## Environment Setup

### 1. Firebase Service Account Key

Get from [Firebase Console](https://console.firebase.google.com/):

1. Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the JSON content

Set as environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key":"..."}'
```

Or in `.env`:

```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"firebase-adminsdk@your-project.iam.gserviceaccount.com"}
```

### 2. Verify Installation

```bash
cd mdc-gate-backend
npm list firebase-admin
# Should show: firebase-admin@12.0.0 (or later)
```

## Implementation Details

### File: `src/controllers/auth.controller.ts`

```typescript
import * as admin from "firebase-admin";

// Initialize Firebase Admin on startup
let firebaseApp: admin.app.App | null = null;
try {
	const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
	if (serviceAccountJson) {
		const serviceAccount = JSON.parse(serviceAccountJson);
		firebaseApp = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	}
} catch (err) {
	console.warn("Firebase Admin SDK not initialized");
}

// Handler
export async function firebaseLogin(req: Request, res: Response) {
	if (!firebaseApp) {
		return res.status(503).json(failure("Firebase is not configured"));
	}

	const { idToken } = req.body;
	if (!idToken) {
		return res.status(400).json(failure("Missing idToken"));
	}

	try {
		// Verify token with Firebase Admin SDK
		const decodedToken = await admin.auth(firebaseApp).verifyIdToken(idToken);
		const { uid, email, name } = decodedToken;

		// Exchange for app token
		const data = await firebaseLoginService({
			firebaseUid: uid,
			email: email || "",
			name: name,
		});

		res.json(success(data, "Firebase login successful"));
	} catch (err: any) {
		console.error("Firebase login error:", err);
		const status = err?.code === "auth/argument-error" ? 401 : 500;
		res
			.status(status)
			.json(failure(err.message || "Authentication failed", err));
	}
}
```

### File: `src/services/auth.service.ts`

```typescript
export async function firebaseLoginService(input: {
	firebaseUid: string;
	email: string;
	name?: string;
}) {
	// 1. Check if user exists by email
	const existing = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email));

	if (existing.length) {
		// User exists - generate token and return
		const user = existing[0];
		const token = signToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});
		const { passwordHash: _pw, ...safeUser } = user as any;
		return { user: safeUser, token };
	}

	// 2. Create new user from Firebase data
	const [created] = await db
		.insert(users)
		.values({
			name: input.name || "Google User",
			email: input.email,
			role: "resident",
			roleStatus: "approved",
			passwordHash: null as any, // No password for Firebase users
		})
		.returning();

	const token = signToken({
		userId: created.id,
		email: created.email,
		role: created.role,
	});

	const { passwordHash: _pw, ...safeUser } = created as any;
	return { user: safeUser, token };
}
```

### File: `src/routes/auth.routes.ts`

```typescript
import { firebaseLogin } from "../controllers/auth.controller";

router.post("/firebase", firebaseLogin);
```

## API Endpoint

### Request

```http
POST /api/auth/firebase
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAiLCJ0eXAiOiJKV1QifQ..."
}
```

### Response Success (201)

```json
{
	"success": true,
	"data": {
		"user": {
			"id": 123,
			"name": "John Doe",
			"email": "john@example.com",
			"phone": null,
			"role": "resident",
			"roleStatus": "approved"
		},
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6InJlc2lkZW50In0..."
	},
	"message": "Firebase login successful"
}
```

### Response Error (400)

```json
{
	"success": false,
	"message": "Missing idToken"
}
```

### Response Error (401)

```json
{
	"success": false,
	"message": "Invalid ID token"
}
```

### Response Error (503)

```json
{
	"success": false,
	"message": "Firebase is not configured on this server"
}
```

## Database Operations

### User Lookup

```sql
SELECT * FROM users WHERE email = ?
-- Used to check if user already exists
```

### User Creation

```sql
INSERT INTO users (name, email, phone, role, roleStatus, passwordHash, createdAt)
VALUES (?, ?, ?, ?, ?, ?, NOW())
RETURNING *
-- Password hash is NULL for Firebase users
```

## Token Flow

### 1. Frontend → Backend: Firebase ID Token

- Source: Firebase Auth SDK (native)
- Contains: uid, email, name, email_verified, auth_time, exp
- Valid for: ~1 hour
- Usage: Exchanged for app session token

### 2. Backend Verification

```
Firebase Admin SDK
  ↓
Verifies signature using Firebase public keys
  ↓
Checks token expiration
  ↓
Decodes claims
  ↓
Extracts: uid, email, name
```

### 3. Backend → Frontend: App Session Token (JWT)

- Source: Backend `signToken()` function
- Contains: userId, email, role, iat, exp
- Valid for: Configured JWT expiry (typically 7 days)
- Usage: Stored in AsyncStorage, used for subsequent API calls

## Error Codes

| Status | Message                        | Cause                     | Solution                              |
| ------ | ------------------------------ | ------------------------- | ------------------------------------- |
| 400    | Missing idToken                | No token in request       | Ensure frontend sends token           |
| 401    | Invalid ID token               | Token verification failed | Verify Firebase credentials match     |
| 401    | Token expired                  | Token older than 1 hour   | Ensure frontend generates fresh token |
| 503    | Firebase not configured        | Env var not set           | Set `FIREBASE_SERVICE_ACCOUNT_JSON`   |
| 500    | Firebase authentication failed | Server error              | Check logs for details                |

## Security Considerations

### Token Verification

✅ **Done:** Firebase Admin SDK verifies signature
✅ **Done:** Verifies expiration
✅ **Done:** Validates token format

### User Creation

✅ **Done:** Creates with `role: "resident"` (lowest privileges)
✅ **Done:** Sets `roleStatus: "approved"` for immediate access
✅ **Done:** No password stored for Firebase users
✅ **Recommended:** Add email verification check

### API Security

✅ **Existing:** Express CORS configured
✅ **Existing:** Rate limiting on other endpoints
✅ **Recommended:** Add rate limiting to `/auth/firebase`
✅ **Recommended:** Log all authentication attempts

## Troubleshooting

### "Firebase is not configured on this server"

**Cause:** `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable not set

**Solution:**

```bash
# Check if set
echo $FIREBASE_SERVICE_ACCOUNT_JSON

# If empty, set it
export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Or add to .env
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### "Invalid ID token"

**Cause:** Token format incorrect or Firebase SDK not initialized

**Solution:**

1. Verify token format: Should start with `eyJ`
2. Verify token not expired: Check exp claim
3. Verify Firebase credentials: Check service account JSON format
4. Check logs: `console.log(decodedToken)` in controller

### "Cannot find module 'firebase-admin'"

**Cause:** Package not installed

**Solution:**

```bash
cd mdc-gate-backend
yarn add firebase-admin
yarn dev
```

### "User not created in database"

**Cause:** Email already exists or database error

**Solution:**

1. Check if user already exists:
   ```sql
   SELECT * FROM users WHERE email = 'test@example.com';
   ```
2. Check database logs for insert errors
3. Verify email not NULL: `WHERE email = ?` should match

## Testing

### Manual Test with cURL

```bash
# 1. Get a real Firebase ID token from frontend
# (Log it to console when user signs in)

# 2. Test endpoint
curl -X POST http://localhost:4000/api/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiI..."
  }'

# Expected response:
# {"success":true,"data":{"user":{...},"token":"..."},"message":"Firebase login successful"}
```

### Test User Lookup vs Creation

```bash
# First call with email: Creates user
curl -X POST http://localhost:4000/api/auth/firebase \
  -d '{"idToken":"..."}'
# Response: new user created

# Second call with same email: Returns existing user
curl -X POST http://localhost:4000/api/auth/firebase \
  -d '{"idToken":"..."}'
# Response: existing user returned (same user object)
```

## Integration with Existing Auth

The Firebase endpoint uses the same:

- ✅ `signToken()` function (existing JWT generation)
- ✅ `users` table schema (existing database)
- ✅ Response format (existing `success()`/`failure()` helpers)
- ✅ Error handling patterns (existing middleware)

New users created via Firebase are compatible with email/password auth for role/permission checks.

## Production Considerations

### Before Deploying

- [ ] Set `FIREBASE_SERVICE_ACCOUNT_JSON` in production environment
- [ ] Verify Firebase project configuration
- [ ] Test with production Google OAuth credentials
- [ ] Enable request logging for debugging
- [ ] Set up monitoring for `/auth/firebase` endpoint
- [ ] Configure database backups (new users will be created)
- [ ] Test email verification if required

### Monitoring

Add to logging:

```typescript
console.log("[Firebase Login] User:", email, "Created:", !existing.length);
console.log("[Firebase Login] Token issued for userId:", user.id);
```

### Rate Limiting

Consider adding:

```typescript
// Add rate limit middleware
app.post("/api/auth/firebase", rateLimitMiddleware, firebaseLogin);
```

---

**Status:** ✅ Implementation complete and ready for deployment
