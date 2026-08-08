import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getSession } from "@/lib/auth";
import { buildMetaOAuthUrl, isMetaConfigured } from "@/lib/meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (session.categoria !== "Creator") {
    return NextResponse.redirect(
      new URL("/dashboard?error=meta_creator_only", req.url)
    );
  }

  if (!isMetaConfigured()) {
    // Dev mode: seed demo + vai subito ad Aura Mirror
    return NextResponse.redirect(
      new URL("/api/meta/demo-connect", req.url)
    );
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.redirect(
      new URL("/dashboard?error=jwt_missing", req.url)
    );
  }

  const state = await new SignJWT({
    userId: session.userId,
    nonce: crypto.randomUUID(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(new TextEncoder().encode(secret));

  const url = buildMetaOAuthUrl(state);
  return NextResponse.redirect(url);
}
