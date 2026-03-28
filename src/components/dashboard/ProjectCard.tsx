"use client";

/**
 * ProjectCard — matches Stitch HTML card design exactly
 * Base Everything Intelligence Terminal
 */

import type { RegionProject } from "@/types/dashboard";

export type ProjectBadgeType = "hot" | "new" | "stable";

export interface ProjectCardData {
  id: string;
  name: string;
  ticker: string;
  badge?: ProjectBadgeType;
  description: string;
  stats: [string, string][]; // [label, value] pairs
  category: string;
  trendPct: number;
  trendData?: number[]; // sparkline bars (0-100 heights)
  onSelect?: (id: string) => void;
}

function Badge({ type }: { type: ProjectBadgeType }) {
  const config = {
    hot: "bg-tertiary-container text-white",
    new: "bg-surface-container text-on-surface-variant",
    stable: "bg-secondary-container text-white",
  } as const;

  const labels = { hot: "d??? HOT", new: "NEW", stable: "STABLE" };

  return (
    <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded-full ${config[type]}`}>
      {labels[type]}
    </span>
  );
}

function Sparkline({ data, positive }: { data?: number[]; positive: boolean }) {
  const heights = data ?? [40, 60, 50, 80, 90];
  const color = positive ? "bg-primary" : "bg-error";
  return (
    <div className="w-12 h-4 flex items-end gap-0.5">
      {heights.map((h, i) => (
        <div key={i} className={`w-1 ${color}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function ProjectCard({
  id,
  name,
  ticker,
  badge,
  description,
  stats,
  category,
  trendPct,
  trendData,
  onSelect,
}: ProjectCardData) {
  const isPositive = trendPct >= 0;
  const trendColor = isPositive ? "text-primary" : "text-error";
  const trendSign = isPositive ? "+" : "";

  return (
    <article
      className="bg-surface-container-lowest border border-outline-variant/40 flex flex-col group cursor-pointer hover:border-primary transition-all"
      onClick={() => onSelect?.(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(id)}
    >
      {/* Card header */}
      <div className="p-4 flex justify-between items-start border-b border-outline-variant/20 bg-surface-container-highest">
        <div className="flex gap-3">
          {/* Logo placeholder */}
          <div className="w-10 h-10 bg-white rounded-sm border border-outline-variant flex items-center justify-center p-1">
            {/* First letter avatar as placeholder */}
            <div className="w-full h-full bg-surface-container-low flex items-center justify-center rounded-sm">
              <span className="text-xs font-black text-primary font-headline">
                {name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-on-surface">{name}</h3>
            <div className="font-mono text-[10px] text-primary font-bold">{ticker}</div>
          </div>
        </div>
        {badge && <Badge type={badge} />}
      </div>

      {/* Card body */}
      <div className="p-4 space-y-4 flex-1">
        <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="bg-surface-container-low p-2 rounded-sm border border-outline-variant/10"
            >
              <div className="font-mono text-[8px] text-outline uppercase">{label}</div>
              <div className="font-mono text-xs font-bold text-on-surface">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-between items-center">
        <span className="px-2 py-0.5 bg-secondary-container/30 text-secondary text-[9px] font-bold font-mono rounded-sm uppercase">
          {category}
        </span>
        <div className="flex items-center gap-1">
          <Sparkline data={trendData} positive={isPositive} />
          <span className={`font-mono text-[10px] font-bold ${trendColor}`}>
            {trendSign}{trendPct.toFixed(1)}%
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Demo cards matching Stitch (Aerodrome, Basecamp, Friend.tech) ───────────

export const DEMO_PROJECTS: ProjectCardData[] = [
  {
    id: "aerodrome",
    name: "Aerodrome",
    ticker: "AERO",
    badge: "hot",
    description: "Central trading and liquidity marketplace on Base. Next-generation AMM model.",
    stats: [
      ["Market Cap", "$142.5M"],
      ["TVL", "$480.1M"],
    ],
    category: "DEFI",
    trendPct: 12.4,
    trendData: [40, 60, 50, 80, 90],
    onSelect: () => {},
  },
  {
    id: "basecamp",
    name: "Basecamp",
    ticker: "CAMP",
    badge: "new",
    description: "Integrated onboarding suite for new developers entering the Base ecosystem.",
    stats: [
      ["Builders", "2,400+"],
      ["Stage", "PUBLIC BETA"],
    ],
    category: "INFRA",
    trendPct: 2.1,
    trendData: [30, 40, 35, 45, 50],
    onSelect: () => {},
  },
  {
    id: "friendtech",
    name: "Friend.tech",
    ticker: "FT",
    badge: "stable",
    description: "Social graph monetization layer. Marketplace for keys to private chats.",
    stats: [
      ["Daily Users", "18.2K"],
      ["TVL", "$31.4M"],
    ],
    category: "SOCIAL",
    trendPct: -4.8,
    trendData: [80, 60, 70, 40, 30],
    onSelect: () => {},
  },
];
