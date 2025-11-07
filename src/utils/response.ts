export type ApiSuccess<T> = { success: true; message?: string; data: T };
export type ApiError = { success: false; message: string; error?: unknown };

export const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
	success: true,
	data,
	message,
});
export const failure = (message: string, error?: unknown): ApiError => ({
	success: false,
	message,
	error,
});
