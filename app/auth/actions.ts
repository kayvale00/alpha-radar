"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/skills";
import { planNameFromId } from "@/lib/plans";

const registerSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "Password minimo 6 caratteri"),
  name: z.string().min(2, "Nome troppo corto"),
  categoria: z.enum([
    "Creator",
    "E-commerce",
    "Trader",
    "Startup",
    "Consulente",
  ]),
  piano: z.enum(["standard", "pro"]).default("standard"),
});

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const parsed = registerSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      // supporta sia name (schema reale) sia nome (legacy form)
      name: formData.get("name") || formData.get("nome"),
      categoria: formData.get("categoria"),
      piano: formData.get("piano") || "standard",
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message || "Dati non validi" };
    }

    const { email, password, name, categoria, piano } = parsed.data;

    if (!CATEGORIES.includes(categoria)) {
      return { error: "Categoria non valida" };
    }

    const supabase = getSupabaseAdmin();
    const normalizedEmail = email.toLowerCase().trim();

    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingError) {
      console.error("Register email check error:", existingError);
      return {
        error: `Database: ${existingError.message || "controllo email fallito"}`,
      };
    }

    if (existing) {
      return { error: "Questa email è già registrata. Prova il login." };
    }

    const hashed = await hashPassword(password);
    if (!hashed || !hashed.startsWith("$2")) {
      return { error: "Hash password fallito. Riprova." };
    }

    // Schema reale: id, email, password, name, created_at
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: normalizedEmail,
        password: hashed,
        name: name.trim(),
      })
      .select("id, email, name")
      .single();

    if (error || !user) {
      console.error("Register insert error:", error);
      if (error?.code === "23505" || error?.message?.includes("duplicate")) {
        return { error: "Questa email è già registrata." };
      }
      return {
        error: error?.message
          ? `Registrazione fallita: ${error.message}`
          : "Registrazione fallita. Riprova.",
      };
    }

    // categoria/piano restano in JWT (non presenti sulla tabella users minimale)
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      nome: user.name,
      categoria,
      piano: planNameFromId(piano),
    });
    await setSessionCookie(token);
  } catch (err) {
    console.error("Register error:", err);
    // Next.js redirect() lancia un errore speciale: non va trattato come failure
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return {
      error:
        err instanceof Error
          ? err.message.includes("Missing") || err.message.includes("JWT_SECRET")
            ? "Configurazione server incompleta (Supabase/JWT)."
            : err.message
          : "Errore imprevisto durante la registrazione.",
    };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message || "Dati non validi" };
    }

    const { email, password } = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password, name")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error("Login query error:", error);
      return { error: "Errore di connessione al database." };
    }

    if (!user) {
      return { error: "Email o password non corretti." };
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return { error: "Email o password non corretti." };
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      nome: user.name || "User",
      categoria: "Creator",
      piano: "Standard",
    });
    await setSessionCookie(token);
  } catch (err) {
    console.error("Login error:", err);
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return {
      error:
        err instanceof Error &&
        (err.message.includes("Missing") || err.message.includes("JWT_SECRET"))
          ? "Configurazione server incompleta (Supabase/JWT)."
          : "Errore imprevisto durante il login.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
