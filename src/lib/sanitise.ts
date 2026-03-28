/**
 * HTML / entity sanitisation — strips characters used in XSS and entity-injection attacks.
 * Applied to every string field before it leaves the service layer.
 */
const DANGEROUS_CHARS = /[<>&\"']/g;
const ESCAPE_MAP: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
};

export function sanitise(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return value.replace(DANGEROUS_CHARS, (ch) => ESCAPE_MAP[ch]);
  }

  if (Array.isArray(value)) {
    return value.map(sanitise);
  }

  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as object)) {
      out[k] = sanitise(v);
    }
    return out;
  }

  return value;
}
