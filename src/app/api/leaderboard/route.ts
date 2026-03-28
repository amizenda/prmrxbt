import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { buildLeaderboard } from '@/services/ecosystem';
import type { LeaderboardResponse, LeaderboardMetric } from '@/types/stitch';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000';

const VALID_METRICS: LeaderboardMetric[] = ['tvl', 'volume', 'users', 'growth'];
const VALID_PERIODS = ['24h', '7d', '30d'] as const;

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
  const metricRaw = searchParams.get('metric') as LeaderboardMetric | null;
  const periodRaw = searchParams.get('period') as typeof VALID_PERIODS[number] | null;
  const category  = searchParams.get('category');

  const metric = VALID_METRICS.includes(metricRaw!) ? metricRaw! : 'tvl';
  const period = VALID_PERIODS.includes(periodRaw!) ? periodRaw! : '24h';

  let rankings = buildLeaderboard(metric);

  if (category) {
    rankings = rankings.filter((r) => r.category === category);
  }

  const response: LeaderboardResponse = {
    metric,
    period,
    rankings,
    updatedAt: new Date().toISOString(),
  };

  return json(response);
}
