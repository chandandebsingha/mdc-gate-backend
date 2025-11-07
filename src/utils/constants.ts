export const Roles = {
	RESIDENT: "resident",
	ADMIN: "admin",
} as const;

export const Messages = {
	UNAUTHORIZED: "Unauthorized",
	FORBIDDEN: "Forbidden",
	NOT_FOUND: "Not found",
	INVALID_PAYLOAD: "Invalid request payload",
} as const;

export const ComplaintStatuses = [
	"open",
	"in_progress",
	"resolved",
	"closed",
] as const;

export const AuthorityValues = [
  "owner",
  "tenant",
  "family",
] as const;

export const OccupancyStatusValues = [
  "owner_occupied",
  "tenant_occupied",
  "vacant",
] as const;
