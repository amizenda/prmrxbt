/**
 * This file is DEPRECATED.
 *
 * HTML entity escaping is only needed before dangerouslySetInnerHTML.
 * React escapes all JSX expressions by default — no manual escaping needed.
 *
 * For input validation and schema enforcement, use Zod at API entry points.
 * See: src/app/api/submit/route.ts for validated submission payload handling.
 *
 * @deprecated Use Zod schemas for input validation instead.
 */
export function sanitise(_value: unknown): unknown {
  // Intentionally a no-op. Kept to avoid breaking any lingering imports.
  return _value;
}
