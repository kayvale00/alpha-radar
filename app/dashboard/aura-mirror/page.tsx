import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCachedSnapshot } from "@/lib/instagram-cache";
import { AuraSkeleton } from "@/components/aura/AuraCharts";
import { AuraMirrorPanel } from "@/components/aura/AuraMirrorPanel";
import { logoutAction } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

async function AuraData({
  userId,
  autoBg,
}: {
  userId: string;
  autoBg: boolean;
}) {
  // SOLO cache — zero Meta. Instant paint.
  const snapshot = await getCachedSnapshot(userId);
  return <AuraMirrorPanel snapshot={snapshot} autoBgRefresh={autoBg} />;
}

export default async function AuraMirrorPage({
  searchParams,
}: {
  searchParams: { connected?: string; bg?: string; demo?: string; ms?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (session.categoria !== "Creator") redirect("/dashboard");

  const autoBg = searchParams.bg === "1" || searchParams.connected === "1";
  const isPro = session.piano === "Pro";

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-neon-magenta/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-neon-green/10 blur-[100px]" />
      </div>

      <header className="relative z-20 border-b border-white/5 bg-cyber-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="font-display text-xs uppercase tracking-widest text-white/50 hover:text-neon-cyan"
            >
              ← Dashboard
            </Link>
            <Link
              href="/dashboard/aura-mirror"
              className="font-display text-lg font-bold tracking-wider text-white"
            >
              AURA<span className="text-neon-magenta">MIRROR</span>
            </Link>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-display text-xs uppercase tracking-widest text-white/60 hover:text-neon-magenta"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {searchParams.connected === "1" && (
          <div className="mb-6 border border-neon-green/40 bg-neon-green/10 px-4 py-3 text-sm text-neon-green animate-fade-in">
            Instagram collegato
            {searchParams.ms ? ` in ${searchParams.ms}ms` : ""}
            {searchParams.demo === "1" ? " (demo)" : ""}. Grafici dalla cache —
            refresh in background.
          </div>
        )}

        <div className={`relative ${!isPro ? 'blur-sm opacity-50' : ''}`}>
          <Suspense fallback={<AuraSkeleton />}>
            <AuraData userId={session.userId} autoBg={autoBg} />
          </Suspense>
        </div>

        {!isPro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="neon-border bg-cyber-card/90 p-8 text-center max-w-sm">
              <p className="font-display text-lg font-bold text-white">🔒 Upgrade to Pro</p>
              <p className="mt-3 text-sm text-white/70">
                Aura Mirror è disponibile solo per i clienti Pro.
              </p>
              <Link 
                href="/checkout/pro" 
                className="mt-6 inline-block btn-primary !px-6 !py-3"
              >
                Upgrade Ora
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}