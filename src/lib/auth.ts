import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "car-option-secret-key-automotive-luxury-2025";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionPayload {
  userId: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  fullName?: string | null;
}

export function signToken(payload: SessionPayload, rememberMe = true): string {
  const expiresIn = rememberMe ? "30d" : "1d";
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}
