import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { MOCK_CATEGORIES } from '@/services/ecosystem';
import type { CategoriesResponse } from '@/types/stitch';

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

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const trendingOnly = searchParams.get('trending') === 'true';

  let categories = [...MOCK_CATEGORIES];

  if (trendingOnly) {
    categories = categories.filter((c) => c.trending);
  }

  // Sort by volume descending
  categories.sort((a, b) => b.stats.volume24h - a.stats.volume24h);

  const response: CategoriesResponse = { categories };

  return json(response);
}
