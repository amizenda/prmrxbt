/**
 * GET /api/wallet/[address]
 *
 * Wallet tracking API — proxies Basescan free API.
 *
 * Query params:
 *   page  — page number (default 1)
 *   limit — results per page (default 20, max 100)
 *
 * Response:
 *   {
 *     address:        string,
 *     txCount:        number,
 *     netFlowUSD:     number,
 *     gasSpentETH:    string,
 *     lastActive:     string (ISO8601),
 *     transactions:   WalletTransaction[]
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchWalletData } from "@/services/wallet";
import { isValidAddress } from "@/utils/wallet";
import { checkRateLimit } from "@/lib/rate-limiter";

// Validated params with defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  // ── 1. Resolve params ──────────────────────────────────────────────────────
  const { address: rawAddress } = await params;
  const address = (rawAddress ?? "").trim();

  // ── 2. Validate address ─────────────────────────────────────────────────────
  if (!isValidAddress(address)) {
    return NextResponse.json(
      {
        error: "Invalid address",
        message: "Address must be a valid Ethereum address (0x + 40 hex chars)",
        code: "INVALID_ADDRESS",
      },
      { status: 400 }
    );
  }

  // ── 2b. Rate limit ─────────────────────────────────────────────────────────
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before making another request." },
      { status: 429 }
    );
  }

  // ── 3. Parse query params ───────────────────────────────────────────────────
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );

  // ── 4. Fetch wallet data ─────────────────────────────────────────────────────
  try {
    const { stats } = await fetchWalletData({ address, page, limit });

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        // Allow client-side caching; server revalidates via fetch cache
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error(`[/api/wallet/${address}] fetch error:`, err);

    return NextResponse.json(
      {
        error: "Failed to fetch wallet data",
        message: "Could not reach Basescan API. Please try again.",
        code: "UPSTREAM_ERROR",
      },
      { status: 502 }
    );
  }
}

// Block non-GET methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
