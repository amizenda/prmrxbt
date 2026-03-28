/**
 * Route constants — single source of truth
 * Import from here instead of hardcoding route strings.
 */

/* ─── App Router paths ─── */
export const ROUTES = {
  HOME:         "/",
  DASHBOARD:    "/dashboard",
  CATEGORIES:   "/categories",
  TRENDING:     "/trending",
  LEADERBOARD:  "/leaderboard",
  SUBMIT:       "/submit",
  ABOUT:        "/about",
  INTELLIGENCE: "/intelligence",
  ECOSYSTEM:    "/ecosystem",
  TERMINAL:     "/terminal",
} as const;

/* ─── Landing page nav ─── */
export const NAV_LANDING = [
  { label: "EXPLORE",      href: ROUTES.HOME },
  { label: "CATEGORIES",   href: ROUTES.CATEGORIES },
  { label: "TRENDING",     href: ROUTES.TRENDING },
  { label: "LEADERBOARDS",href: ROUTES.LEADERBOARD },
  { label: "SUBMIT",       href: ROUTES.SUBMIT },
  { label: "ABOUT",        href: ROUTES.ABOUT },
] as const;

/* ─── Dashboard nav ─── */
export const NAV_DASHBOARD = [
  { label: "DASHBOARD",   href: ROUTES.DASHBOARD },
  { label: "INTELLIGENCE",href: ROUTES.INTELLIGENCE },
  { label: "ECOSYSTEM",   href: ROUTES.ECOSYSTEM },
  { label: "TERMINAL",    href: ROUTES.TERMINAL },
] as const;
