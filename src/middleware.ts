import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Security headers (applied to ALL routes) ─────────────────────────────────
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }

  return res;
}

export const config = {
  // Apply to all API routes and pages
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
