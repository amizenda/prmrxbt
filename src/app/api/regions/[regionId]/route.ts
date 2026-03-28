/**
 * GET /api/regions/[regionId]
 *
 * Detailed data for a single ecosystem region / category.
 *
 * Query params:
 *   page  — page number (default 1)
 *   limit — results per page (default 20, max 100)
 *
 * Response:
 *   {
 *     id:            ProjectCategory,
 *     name:          string,
 *     description:   string,
 *     projectCount:  number,
 *     volume24h:     number,
 *     tvl:           number,
 *     activeWallets: number,
 *     growth24h:     number,
 *     projects:      RegionProject[],
 *     updatedAt:     string (ISO-8601)
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { SECURITY_HEADERS } from "@/lib/security-headers";
import { buildRegionResponse } from "@/services/dashboard";
import type { RegionResponse } from "@/types/dashboard";
import type { ProjectCategory } from "@/services/ecosystem";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "http://localhost:3000";

const VALID_REGIONS = new Set<ProjectCategory>([
  "defi",
  "nft",
  "social",
  "infrastructure",
  "bridge",
  "yield",
  "gaming",
  "dao",
]);

function json(data: RegionResponse, init?: ResponseInit) {
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ regionId: string }> }
) {
  // ── 1. Resolve params ──────────────────────────────────────────────────────
  const { regionId: rawId } = await params;
  const regionId = (rawId ?? "").trim().toLowerCase();

  // ── 2. Validate region ID ───────────────────────────────────────────────────
  if (!regionId || !VALID_REGIONS.has(regionId as ProjectCategory)) {
    return NextResponse.json(
      {
        error: "Invalid region",
        message: `Unknown region '${regionId}'. Valid regions: ${[...VALID_REGIONS].join(", ")}`,
        code: "INVALID_REGION",
      },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  // ── 3. Rate limit ─────────────────────────────────────────────────────────
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1";

  const { allowed, limit, remaining, resetAt } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before making another request." },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          "Retry-After": String(resetAt - Math.floor(Date.now() / 1000)),
        },
      }
    );
  }

  // ── 4. Parse query params ─────────────────────────────────────────────────
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit_q = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20)
  );

  // ── 5. Build response ──────────────────────────────────────────────────────
  let region: RegionResponse | null;
  try {
    region = buildRegionResponse(regionId);
  } catch (err) {
    console.error(`[/api/regions/${regionId}] build error:`, err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }

  if (!region) {
    return NextResponse.json(
      { error: "Region not found" },
      { status: 404, headers: SECURITY_HEADERS }
    );
  }

  // ── 6. Paginate projects ───────────────────────────────────────────────────
  const total = region.projects.length;
  const totalPages = Math.ceil(total / limit_q);
  const start = (page - 1) * limit_q;
  const paginatedProjects = region.projects.slice(start, start + limit_q);

  const paginatedRegion: RegionResponse = {
    ...region,
    projects: paginatedProjects,
  };

  // ── 7. Return ─────────────────────────────────────────────────────────────
  return json(paginatedRegion, {
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
