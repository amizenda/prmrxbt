import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { MOCK_LAUNCH_PROJECTS } from '@/services/ecosystem';
import type { TerminalResponse } from '@/types/stitch';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000';

const LAUNCH_STAGES_ORDER = [
  'ideation',
  'design',
  'development',
  'testnet',
  'audit',
  'launch',
  'live',
  'archived',
] as const;

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
  const stage   = searchParams.get('stage');
  const status  = searchParams.get('status');
  const category = searchParams.get('category');

  let projects = [...MOCK_LAUNCH_PROJECTS];

  if (stage)    projects = projects.filter((p) => p.stage    === stage);
  if (status)   projects = projects.filter((p) => p.status    === status);
  if (category) projects = projects.filter((p) => p.category  === category);

  // Sort: active first, then by updatedAt
  projects.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return  1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const response: TerminalResponse = {
    projects,
    stages: [...LAUNCH_STAGES_ORDER],
    total: projects.length,
  };

  return json(response);
}
