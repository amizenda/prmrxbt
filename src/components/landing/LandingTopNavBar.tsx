"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "EXPLORE",     href: "/dashboard",    active: true  },
  { label: "CATEGORIES",  href: "/categories",   active: false },
  { label: "TRENDING",    href: "/trending",     active: false },
  { label: "LEADERBOARDS",href: "/leaderboard",  active: false },
  { label: "SUBMIT",      href: "/submit",       active: false },
  { label: "ABOUT",       href: "/about",        active: false },
];

export function LandingTopNavBar() {
  const [dark, setDark] = useState(false);

  return (
    <>
      {/* ── TopNavBar (desktop) ── */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14
        bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-tighter text-on-surface uppercase
            font-[family-name:var(--font-headline)]">
            Base Everything
          </span>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  font-[family-name:var(--font-label)] font-bold tracking-tight text-sm uppercase
                  transition-colors duration-200 pb-1 border-b
                  ${link.active
                    ? "text-primary border-primary"
                    : "text-outline hover:text-on-surface border-transparent hover:border-outline-variant"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="material-symbols-outlined text-outline hover:text-primary
              transition-all p-2 rounded-full hover:bg-surface-container"
          >
            {dark ? "light_mode" : "dark_mode"}
          </button>

          {/* Connect Wallet CTA */}
          <button
            className="bg-primary hover:bg-primary-container text-on-primary
              px-4 py-2 text-sm font-bold uppercase tracking-tight
              rounded-sm transition-all active:scale-95 font-[family-name:var(--font-label)]"
          >
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* ── Mobile BottomNavBar ── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center
        px-4 py-2 lg:hidden backdrop-blur-md bg-surface/90 border-t border-outline-variant/40">
        {[
          { icon: "explore",               label: "EXPLORE",  href: "/dashboard",  active: true  },
          { icon: "trending_up",           label: "TRENDS",   href: "/trending",   active: false },
          { icon: "bookmark",              label: "SAVED",    href: "/submit",     active: false },
          { icon: "account_balance_wallet",label: "WALLET",   href: "/submit",     active: false },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 ${
              item.active ? "text-primary" : "text-outline"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="font-mono text-[9px] font-bold uppercase mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
