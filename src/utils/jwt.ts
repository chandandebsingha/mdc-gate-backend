import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = {
	userId: number;
	email: string;
	role: string;
};

export function signToken(
	payload: JwtPayload,
	expiresIn: string | number = "7d"
) {
	const options: SignOptions = { expiresIn: expiresIn as any };
	return jwt.sign(payload, env.JWT_SECRET as Secret, options);
}

export function verifyToken<T = JwtPayload>(token: string) {
	return jwt.verify(token, env.JWT_SECRET) as T;
}
