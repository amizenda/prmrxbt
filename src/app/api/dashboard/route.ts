/**
 * GET /api/dashboard
 *
 * Dashboard overview — the "App Dashboard & Map" stitch screen data hub.
 * Returns aggregated ecosystem overview, region summaries, and trending items.
 *
 * Response:
 *   {
 *     overview:        DashboardOverview,
 *     regions:         RegionSummary[],
 *     trendingNow:     TrendingNowEntry[],
 *     lastUpdated:     string (ISO-8601)
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { SECURITY_HEADERS } from "@/lib/security-headers";
import { buildDashboardResponse } from "@/services/dashboard";
import type { DashboardResponse } from "@/types/dashboard";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "http://localhost:3000";

function json(data: DashboardResponse, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...SECURITY_HEADERS,
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? ALLOWED_ORIGIN;
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...SECURITY_HEADERS,
      "Access-Control-Allow-Origin": origin,`n      "Vary": "Origin",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(req: NextRequest) {
  // ── 1. Rate limit ─────────────────────────────────────────────────────────
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1";

  const { allowed, limit, remaining, resetAt } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before making another request." },
      { status: 429, headers: { ...SECURITY_HEADERS, "Retry-After": String(resetAt - Math.floor(Date.now() / 1000)) } }
    );
  }

  // ── 2. Build response ──────────────────────────────────────────────────────
  let response: DashboardResponse;
  try {
    response = buildDashboardResponse();
  } catch (err) {
    console.error("[/api/dashboard] build error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }

  // ── 3. Return ───────────────────────────────────────────────────────────────
  return json(response, {
    status: 200,
    headers: {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(resetAt),
    },
  });
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: SECURITY_HEADERS });
}
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: SECURITY_HEADERS });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: SECURITY_HEADERS });
}
