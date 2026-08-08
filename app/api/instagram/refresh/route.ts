import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { refreshInstagramData } from "@/lib/instagram-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Refresh Instagram.
 * ?force=1 → bypass cache 30min
 * Default → aggiorna solo se stale
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const force =
    req.nextUrl.searchParams.get("force") === "1" ||
    (await req.json().catch(() => ({}))).force === true;

  const started = Date.now();
  const snapshot = await refreshInstagramData(session.userId, { force });

  return NextResponse.json({
    ok: true,
    ms: Date.now() - started,
    snapshot: {
      connected: snapshot.connected,
      stale: snapshot.stale,
      demo: snapshot.demo,
      fetchedAt: snapshot.fetchedAt,
      expiresAt: snapshot.expiresAt,
      profile: snapshot.profile,
      metrics: snapshot.metrics,
      mediaCount: snapshot.media.length,
    },
  });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get("force") === "1";
  const started = Date.now();
  const snapshot = await refreshInstagramData(session.userId, { force });

  return NextResponse.json({
    ok: true,
    ms: Date.now() - started,
    snapshot,
  });
}
