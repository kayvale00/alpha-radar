import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSession } from "@/lib/auth";
import {
  exchangeCodeForToken,
  exchangeLongLivedToken,
  fetchIgProfile,
  resolveInstagramAccount,
} from "@/lib/meta";
import { saveInstagramAccountFast } from "@/lib/instagram-account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * OAuth callback — PATH CRITICO PER VELOCITÀ (< 2s → dashboard).
 * 1) exchange token
 * 2) resolve IG + profile (timeout aggressivi)
 * 3) seed cache
 * 4) redirect IMMEDIATO ad Aura Mirror
 * Media insights: refresh in background dal client.
 */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard?error=meta_${error}`, req.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard?error=meta_missing_code", req.url)
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");

    const { payload } = await jwtVerify(
      state,
      new TextEncoder().encode(secret)
    );
    if (payload.userId !== session.userId) {
      throw new Error("State mismatch");
    }

    const short = await exchangeCodeForToken(code);
    const longLived = await exchangeLongLivedToken(short.access_token);
    const { igUserId, pageToken } = await resolveInstagramAccount(
      longLived.access_token,
      1400
    );
    const profile = await fetchIgProfile(igUserId, pageToken, 1000);

    const expiresAt = longLived.expires_in
      ? new Date(Date.now() + longLived.expires_in * 1000)
      : null;

    await saveInstagramAccountFast({
      userId: session.userId,
      profile,
      accessToken: pageToken,
      tokenExpiresAt: expiresAt,
    });

    const elapsed = Date.now() - started;
    console.log(`[meta/callback] connected in ${elapsed}ms`);

    return NextResponse.redirect(
      new URL(
        `/dashboard/aura-mirror?connected=1&ms=${elapsed}&bg=1`,
        req.url
      )
    );
  } catch (err) {
    console.error("Meta callback error:", err);
    const msg =
      err instanceof Error
        ? encodeURIComponent(err.message.slice(0, 80))
        : "unknown";
    return NextResponse.redirect(
      new URL(`/dashboard?error=meta_failed&detail=${msg}`, req.url)
    );
  }
}
