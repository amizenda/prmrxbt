import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { MOCK_TRENDING_PROJECTS, MOCK_TRENDING_TOKENS } from '@/services/ecosystem';
import type { TrendingResponse } from '@/types/stitch';

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
  const timeframe = (searchParams.get('timeframe') as TrendingResponse['timeframe']) ?? '24h';
  const category   = searchParams.get('category');

  let projects = [...MOCK_TRENDING_PROJECTS];
  let tokens   = [...MOCK_TRENDING_TOKENS];

  if (category) {
    projects = projects.filter((p) => p.category === category);
  }

  // Sort by change descending
  projects.sort((a, b) => b.change - a.change);
  tokens.sort((a, b) => b.change24h - a.change24h);

  const response: TrendingResponse = {
    timeframe,
    projects,
    tokens,
    updatedAt: new Date().toISOString(),
  };

  return json(response);
}
