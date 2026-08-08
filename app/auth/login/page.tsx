"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction, AuthState } from "../actions";
import { Navbar } from "@/components/Navbar";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Accesso in corso..." : "Accedi"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-1/4 h-[260px] w-[260px] rounded-full bg-neon-cyan/10 blur-[100px]" />
      </div>
      <Navbar showAuth={false} />

      <main className="relative z-10 mx-auto max-w-md px-4 py-12 sm:py-16">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-cyan">
          Login
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Bentornato
        </h1>
        <p className="mt-2 text-white/50">Accedi al tuo radar personale.</p>

        <form
          action={formAction}
          className="mt-8 space-y-5 neon-border bg-cyber-card/80 p-6 animate-slide-up"
        >
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
              autoComplete="current-password"
              className="input-cyber"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <div className="border border-neon-magenta/40 bg-neon-magenta/10 px-3 py-2 text-sm text-neon-magenta">
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-white/45">
          Non hai un account?{" "}
          <Link
            href="/auth/register"
            className="text-neon-cyan hover:underline"
          >
            Registrati
          </Link>
        </p>
      </main>
    </div>
  );
}
