"use client";

import Link from "next/link";

// ─────────────────────────────────────────────────────────
// Landing Footer — synced from Stitch editorial
// Design: slim, monospace, terminal aesthetic
// ─────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  { label: "Categories",    href: "/categories"  },
  { label: "Socials",        href: "/socials"     },
  { label: "Submit",        href: "/submit"       },
  { label: "Documentation", href: "/docs"          },
  { label: "Privacy",       href: "/privacy"      },
];

export function LandingFooter() {
  return (
    <footer className="w-full px-8 flex flex-col md:flex-row justify-between items-center
      gap-4 bg-surface border-t border-outline-variant/40 py-8">

      {/* Brand + tagline */}
      <div className="flex flex-col gap-2">
        <span className="font-bold text-on-surface uppercase tracking-tighter
          font-[family-name:var(--font-headline)]">
          BASE EVERYTHING
        </span>
        <p className="font-mono text-[10px] uppercase tracking-tighter text-outline">
          &copy; 2024 BASE EVERYTHING. ECOSYSTEM INTELLIGENCE TERMINAL.
        </p>
      </div>

      {/* Footer links */}
      <nav className="flex flex-wrap justify-center gap-6">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-[10px] uppercase tracking-tighter text-outline
              hover:text-primary transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mainnet sync status */}
      <div className="flex items-center gap-4">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse flex-shrink-0" />
        <span className="font-mono text-[10px] uppercase tracking-tighter text-outline
          whitespace-nowrap">
          Mainnet Sync: 100%
        </span>
      </div>
    </footer>
  );
}
