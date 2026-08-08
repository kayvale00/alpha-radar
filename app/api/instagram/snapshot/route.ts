import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCachedSnapshot } from "@/lib/instagram-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Snapshot dalla cache — zero Meta. Instant. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const started = Date.now();
  const snapshot = await getCachedSnapshot(session.userId);

  return NextResponse.json({
    ok: true,
    ms: Date.now() - started,
    snapshot,
  });
}
