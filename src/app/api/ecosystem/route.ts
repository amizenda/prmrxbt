import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { filterProjects, MOCK_PROJECTS } from '@/services/ecosystem';
import type { EcosystemFilters, EcosystemResponse } from '@/types/stitch';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000';

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...SECURITY_HEADERS, ...(init?.headers as Record<string, string> | undefined) },
  });
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') ?? ALLOWED_ORIGIN;
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...SECURITY_HEADERS,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('cf-connecting-ip') ??
            req.headers.get('x-real-ip') ??
            req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
            '127.0.0.1';

  const { allowed, limit, remaining, resetAt } = checkRateLimit(ip);
  if (!allowed) {
    return json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);

  const filters: EcosystemFilters = {
    search:      searchParams.get('search')    ?? undefined,
    category:    (searchParams.get('category') as EcosystemFilters['category']) ?? 'all',
    sort:        (searchParams.get('sort') as EcosystemFilters['sort'])    ?? 'tvl',
    page:        Math.max(1, Number(searchParams.get('page')  ?? 1)),
    limit:       Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20))),
  };

  const filtered = filterProjects(MOCK_PROJECTS, filters);

  const page     = filters.page!;
  const limit    = filters.limit!;
  const total    = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start    = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const response: EcosystemResponse = {
    projects: paginated,
    meta: { total, page, limit, totalPages },
  };

  return json(response, undefined, {
    'X-RateLimit-Limit':     String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset':      String(resetAt),
  });
}
