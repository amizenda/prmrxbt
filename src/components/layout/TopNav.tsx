"use client";

/**
 * TopNav — matches Stitch HTML exactly
 * Base Everything Intelligence Terminal
 */

interface TopNavProps {
  activeNav?: string;
}

export function TopNav({ activeNav = "explore" }: TopNavProps) {
  const NAV_LINKS = [
    { id: "explore", label: "EXPLORE" },
    { id: "categories", label: "CATEGORIES" },
    { id: "trending", label: "TRENDING" },
    { id: "leaderboards", label: "LEADERBOARDS" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-slate-50 dark:bg-slate-950 bg-opacity-90 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40">
      {/* Left: logo + nav */}
      <div className="flex items-center gap-8">
        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-50">
          Base Everything
        </span>
        <nav className="hidden md:flex gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = link.id === activeNav;
            return (
              <a
                key={link.id}
                href="#"
                className={[
                  "font-bold tracking-tight text-sm uppercase font-mono pb-1 transition-colors duration-200",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
                ].join(" ")}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Right: dark mode + connect wallet */}
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded transition-all">
          dark_mode
        </button>
        <button className="bg-primary text-on-primary px-4 py-1.5 text-xs font-bold uppercase tracking-tight rounded-sm hover:opacity-90 transition-all font-mono">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
