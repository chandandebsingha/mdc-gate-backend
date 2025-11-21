import { z } from "zod";
import {
	ComplaintStatuses,
	AuthorityValues,
	OccupancyStatusValues,
} from "../utils/constants";

export const idParamSchema = z.object({ id: z.string().regex(/^\d+$/) });

// Auth
export const registerSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
	phone: z.string().optional(),
});
export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

// Complaints
export const createComplaintSchema = z.object({
	category: z.string().min(1),
	subcategory: z.string().min(1),
	requestType: z.enum(["unit", "community"]),
	isUrgent: z.boolean().optional(),
	description: z.string().min(5),
	imageUrl: z.string().url().optional(),
});
export const updateComplaintStatusSchema = z.object({
	status: z.enum(ComplaintStatuses),
});

// Amenities booking
export const bookAmenitySchema = z.object({}); // no body; path param only

// Payments
export const createPaymentSchema = z.object({
	amount: z.string().regex(/^(\d+)(\.\d{1,2})?$/), // simple validation; could refine
	paymentType: z.string().min(3),
});

// Visitors
export const approveVisitorSchema = z.object({
	visitorName: z.string().min(1),
	vehicleNumber: z.string().optional(),
	date: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
});

// Family members
export const addFamilyMemberSchema = z.object({
	name: z.string().min(1),
	relation: z.string().min(2),
	phone: z.string().optional(),
});

// User details
export const upsertUserDetailsSchema = z.object({
	country: z.string().min(1),
	state: z.string().min(1),
	city: z.string().min(1),
	society: z.string().min(1),
	societyId: z.number(),
	buildingName: z.string().min(1),
	block: z.string().min(1),
	authority: z.enum(AuthorityValues).optional(),
	occupancyStatus: z.enum(OccupancyStatusValues).optional(),
	document: z.string().url().optional(),
});

export type UpsertUserDetailsInput = z.infer<typeof upsertUserDetailsSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintStatusInput = z.infer<
	typeof updateComplaintStatusSchema
>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ApproveVisitorInput = z.infer<typeof approveVisitorSchema>;
export type AddFamilyMemberInput = z.infer<typeof addFamilyMemberSchema>;
