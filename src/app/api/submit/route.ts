import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SECURITY_HEADERS } from '@/lib/security-headers';
import { sanitise } from '@/lib/sanitise';
import type { SubmitPayload, SubmitResponse } from '@/types/stitch';

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
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'defi', 'nft', 'gaming', 'social', 'infrastructure', 'dao', 'yield', 'bridge',
];

const ETH_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const URL_RE = /^https?:\/\/.+/;

function validatePayload(body: Partial<SubmitPayload>): string | null {
  if (!body.name?.trim())                          return 'name is required';
  if (body.name.trim().length > 100)               return 'name must be ≤100 characters';
  if (!body.description?.trim())                   return 'description is required';
  if (body.description.trim().length > 1000)       return 'description must be ≤1000 characters';
  if (!body.category || !VALID_CATEGORIES.includes(body.category)) return 'valid category is required';
  if (!body.url || !URL_RE.test(body.url))         return 'valid URL is required';
  if (body.contractAddress && !ETH_ADDRESS_RE.test(body.contractAddress)) {
    return 'invalid Ethereum contract address';
  }
  return null;
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('cf-connecting-ip') ??
            req.headers.get('x-real-ip') ??
            req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
            '127.0.0.1';

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: Partial<SubmitPayload>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    return json({ error: validationError }, { status: 400 });
  }

  // Sanitise
  const safe = sanitise(body) as SubmitPayload;
  const submittedAt = new Date().toISOString();
  const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // In production this would write to a DB / queue for manual review.
  // For MVP we return success with the generated ID.
  const response: SubmitResponse = {
    success: true,
    id,
    message: 'Project submitted successfully. Our team will review and reach out within 3 business days.',
    submittedAt,
  };

  return json(response, { status: 201 });
}

// ─── GET (stub) ───────────────────────────────────────────────────────────────

export async function GET(_req: NextRequest) {
  return json(
    { error: 'Method not allowed. Use POST to submit a project.' },
    { status: 405 },
  );
}
