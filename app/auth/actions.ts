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
  nome: z.string().min(2, "Nome troppo corto"),
  categoria: z.enum(["Creator", "E-commerce", "Trader", "Startup", "Consulente"]),
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
      nome: formData.get("nome"),
      categoria: formData.get("categoria"),
      piano: formData.get("piano") || "standard",
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message || "Dati non validi" };
    }

    const { email, password, nome, categoria, piano } = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return { error: "Questa email è già registrata. Prova il login." };
    }

    if (!CATEGORIES.includes(categoria)) {
      return { error: "Categoria non valida" };
    }

    const hashed = await hashPassword(password);
    const pianoName = planNameFromId(piano);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password: hashed,
        nome: nome.trim(),
        categoria,
        piano: pianoName,
      })
      .select("id, email, nome, categoria, piano")
      .single();

    if (error || !user) {
      console.error("Register insert error:", error);
      return {
        error:
          error?.message?.includes("duplicate") || error?.code === "23505"
            ? "Questa email è già registrata."
            : "Registrazione fallita. Riprova.",
      };
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      nome: user.nome,
      categoria: user.categoria,
      piano: user.piano,
    });
    await setSessionCookie(token);
  } catch (err) {
    console.error("Register error:", err);
    return {
      error:
        err instanceof Error && err.message.includes("Missing")
          ? "Configurazione server incompleta (Supabase/JWT)."
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
      .select("*")
      .eq("email", email.toLowerCase())
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
      nome: user.nome,
      categoria: user.categoria,
      piano: user.piano,
    });
    await setSessionCookie(token);
  } catch (err) {
    console.error("Login error:", err);
    return {
      error:
        err instanceof Error && err.message.includes("Missing")
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
