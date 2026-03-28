import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { MOCK_SIGNALS, MOCK_METRICS } from '@/services/ecosystem';
import type { IntelligenceResponse } from '@/types/stitch';

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
  const severity = searchParams.get('severity');
  const type     = searchParams.get('type');

  let signals = [...MOCK_SIGNALS];

  if (severity) {
    signals = signals.filter((s) => s.severity === severity);
  }
  if (type) {
    signals = signals.filter((s) => s.type === type);
  }

  // Sort newest first
  signals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const response: IntelligenceResponse = {
    signals,
    metrics: MOCK_METRICS,
    updatedAt: new Date().toISOString(),
  };

  return json(response);
}
