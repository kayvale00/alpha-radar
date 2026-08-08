import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDemoSnapshot } from "@/lib/meta";
import { saveInstagramAccountFast } from "@/lib/instagram-account";
import { upsertCache } from "@/lib/instagram-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Dev/demo connect senza Meta App — seed cache + redirect < 2s */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const demo = getDemoSnapshot(
    session.nome.toLowerCase().replace(/\s+/g, "_") || "creator"
  );

  await saveInstagramAccountFast({
    userId: session.userId,
    profile: demo.profile,
    accessToken: "demo-token",
    tokenExpiresAt: null,
  });
  await upsertCache(session.userId, demo.profile, demo.media);

  const elapsed = Date.now() - started;
  return NextResponse.redirect(
    new URL(
      `/dashboard/aura-mirror?connected=1&demo=1&ms=${elapsed}`,
      req.url
    )
  );
}
