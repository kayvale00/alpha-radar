"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { registerAction, AuthState } from "../actions";
import { CATEGORIES } from "@/lib/skills";
import { Navbar } from "@/components/Navbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Creazione account..." : "Crea account"}
    </button>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const plan =
    planParam === "pro" || planParam === "standard" ? planParam : "standard";

  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <>
      <p className="mt-2 text-white/50">
        Piano selezionato:{" "}
        <span className="text-neon-green font-semibold uppercase">{plan}</span>
      </p>

      <form
        action={formAction}
        className="mt-8 space-y-5 neon-border bg-cyber-card/80 p-6 animate-slide-up"
      >
        <input type="hidden" name="piano" value={plan} />

        <div>
          <label htmlFor="nome" className="label-cyber">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="input-cyber"
            placeholder="Il tuo nome"
          />
        </div>

        <div>
          <label htmlFor="email" className="label-cyber">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input-cyber"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="label-cyber">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input-cyber"
            placeholder="Minimo 6 caratteri"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="label-cyber">
            Categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="input-cyber"
            defaultValue=""
          >
            <option value="" disabled>
              Seleziona categoria
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {state.error && (
          <div className="border border-neon-magenta/40 bg-neon-magenta/10 px-3 py-2 text-sm text-neon-magenta">
            {state.error}
          </div>
        )}

        <SubmitButton />
      </form>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-1/4 h-[260px] w-[260px] rounded-full bg-neon-green/10 blur-[100px]" />
      </div>
      <Navbar showAuth={false} />

      <main className="relative z-10 mx-auto max-w-md px-4 py-12 sm:py-16">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-cyan">
          Registrazione
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Attiva Alpha Radar
        </h1>

        <Suspense fallback={<LoadingSpinner label="Caricamento form..." />}>
          <RegisterForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-white/45">
          Hai già un account?{" "}
          <Link href="/auth/login" className="text-neon-cyan hover:underline">
            Login
          </Link>
        </p>
      </main>
    </div>
  );
}
