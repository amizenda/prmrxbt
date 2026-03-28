"use client";

/**
 * Sidebar — matches Stitch HTML exactly
 * Base Everything Intelligence Terminal
 */

import { useState } from "react";

// ─── Nav items (mirrors Stitch HTML structure) ────────────────────────────────

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "DASHBOARD",
    icon: "grid_view",
    active: true,
  },
  {
    id: "intelligence",
    label: "INTELLIGENCE",
    icon: "insights",
    active: false,
  },
  {
    id: "ecosystem",
    label: "ECOSYSTEM",
    icon: "hub",
    active: false,
  },
  {
    id: "terminal",
    label: "TERMINAL",
    icon: "terminal",
    active: false,
  },
];

interface SidebarProps {
  activeNav?: string;
  onNavChange?: (id: string) => void;
}

export function Sidebar({ activeNav = "dashboard", onNavChange }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 z-40 bg-slate-100 dark:bg-slate-900 border-r border-slate-200/40 dark:border-slate-800/40">
      {/* Avatar / user section */}
      <div className="p-6 border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant/40 overflow-hidden">
            {/* Placeholder avatar — geometric */}
            <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-primary font-headline">BE</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              BASE_USER_01
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              Verified Curator
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNav;
            const isHovered = item.id === hovered && !isActive;
            return (
              <button
                key={item.id}
                onClick={() => onNavChange?.(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={[
                  "w-full flex items-center gap-3 px-6 py-3 font-mono text-[10px] tracking-widest uppercase transition-all",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 translate-x-1"
                    : isHovered
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    : "text-slate-500 dark:text-slate-400",
                ].join(" ")}
              >
                <span className="material-symbols-outlined text-lg leading-none">
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Submit Project button */}
      <div className="p-6">
        <button className="w-full bg-surface-container-highest border border-outline-variant text-slate-900 font-mono text-[10px] py-3 tracking-widest font-bold uppercase hover:bg-surface-container transition-all rounded-sm">
          SUBMIT PROJECT
        </button>
      </div>

      {/* Settings / Support */}
      <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="flex justify-between px-2">
          <button className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">settings</span>
            Settings
          </button>
          <button className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">help_outline</span>
            Support
          </button>
        </div>
      </div>
    </aside>
  );
}
