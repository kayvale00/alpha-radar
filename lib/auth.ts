import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin, UserRow } from "./supabase";

export const SESSION_COOKIE = "alpha_radar_session";
const SESSION_DAYS = 7;

export type SessionPayload = {
  userId: string;
  email: string;
  nome: string;
  categoria: string;
  piano: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    nome: payload.nome,
    categoria: payload.categoria,
    piano: payload.piano,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getJwtSecret());
}

function extractUserId(payload: Record<string, unknown>): string | null {
  const raw =
    payload.userId ?? payload.sub ?? payload.id ?? payload.user_id;

  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.trim();
  }
  return null;
}

function parseSessionPayload(
  payload: Record<string, unknown>
): SessionPayload | null {
  const userId = extractUserId(payload);
  if (!userId) return null;

  const email = payload.email;
  if (typeof email !== "string" || !email.trim()) return null;

  return {
    userId,
    email: email.trim(),
    nome: typeof payload.nome === "string" ? payload.nome : "User",
    categoria:
      typeof payload.categoria === "string" ? payload.categoria : "Creator",
    piano: typeof payload.piano === "string" ? payload.piano : "Standard",
  };
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return parseSessionPayload(payload as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session?.userId) {
    console.error("[auth] JWT valido ma userId mancante nel payload");
    return null;
  }

  return session;
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function getCurrentUser(): Promise<UserRow | null> {
  const session = await getSession();
  if (!session) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.userId)
    .single();

  if (error || !data) return null;
  return data as UserRow;
}
