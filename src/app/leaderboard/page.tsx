"use client";

/**
 * Leaderboard — /leaderboard
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Metric = "tvl" | "volume" | "users" | "growth";
type Timeframe = "24h" | "7d" | "30d";
type SortDir = "asc" | "desc";

interface LeaderboardEntry {
  id: string;
  rank: number;
  prevRank: number;
  name: string;
  category: string;
  tvl: string;
  tvlNum: number;
  volume24h: string;
  users: string;
  growth: string; // percent
  growthNum: number;
  trend: "up" | "down" | "stable";
  verified: boolean;
  badge?: "top" | "rising" | "new";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ENTRIES: LeaderboardEntry[] = [
  { id: "uniswap-v4", rank: 1, prevRank: 1, name: "Uniswap V4", category: "DeFi", tvl: "$842M", tvlNum: 842, volume24h: "$312M", users: "1.2M", growth: "+18.4%", growthNum: 18.4, trend: "up", verified: true, badge: "top" },
  { id: "aerodrome", rank: 2, prevRank: 3, name: "Aerodrome", category: "DeFi", tvl: "$284M", tvlNum: 284, volume24h: "$98M", users: "340K", growth: "+22.1%", growthNum: 22.1, trend: "up", verified: true, badge: "top" },
  { id: "usdc", rank: 3, prevRank: 2, name: "USDC", category: "Stablecoin", tvl: "—", tvlNum: 0, volume24h: "$842M", users: "—", growth: "+0.02%", growthNum: 0.02, trend: "stable", verified: true, badge: "top" },
  { id: "baseswap", rank: 4, prevRank: 8, name: "BaseSwap", category: "DeFi", tvl: "$156M", tvlNum: 156, volume24h: "$67M", users: "210K", growth: "+41.2%", growthNum: 41.2, trend: "up", verified: true, badge: "rising" },
  { id: "friend-tech", rank: 5, prevRank: 12, name: "Friend.tech", category: "Social", tvl: "—", tvlNum: 0, volume24h: "$24M", users: "890K", growth: "+89.0%", growthNum: 89.0, trend: "up", verified: true, badge: "rising" },
  { id: "thirdweb", rank: 6, prevRank: 5, name: "thirdweb", category: "Infrastructure", tvl: "—", tvlNum: 0, volume24h: "—", users: "4.2M", growth: "+12.4%", growthNum: 12.4, trend: "up", verified: true, badge: "top" },
  { id: "across", rank: 7, prevRank: 4, name: "Across", category: "Bridges", tvl: "$312M", tvlNum: 312, volume24h: "$48M", users: "88K", growth: "+4.2%", growthNum: 4.2, trend: "stable", verified: true, badge: undefined },
  { id: "orbit-finance", rank: 8, prevRank: 20, name: "Orbit Finance", category: "DeFi", tvl: "$98M", tvlNum: 98, volume24h: "$12M", users: "24K", growth: "+124.0%", growthNum: 124.0, trend: "up", verified: false, badge: "rising" },
  { id: "poolshark", rank: 9, prevRank: 7, name: "Poolshark", category: "DeFi", tvl: "$89M", tvlNum: 89, volume24h: "$41M", users: "85K", growth: "+6.8%", growthNum: 6.8, trend: "up", verified: false, badge: undefined },
  { id: "sound-protocol", rank: 10, prevRank: 31, name: "Sound Protocol", category: "NFT", tvl: "—", tvlNum: 0, volume24h: "$8M", users: "42K", growth: "+312.0%", growthNum: 312.0, trend: "up", verified: false, badge: "new" },
  { id: "mint-house", rank: 11, prevRank: 9, name: "Mint House", category: "NFT", tvl: "—", tvlNum: 0, volume24h: "$14M", users: "92K", growth: "+18.4%", growthNum: 18.4, trend: "up", verified: true, badge: undefined },
  { id: "stargate", rank: 12, prevRank: 11, name: "Stargate", category: "Bridges", tvl: "$189M", tvlNum: 189, volume24h: "$32M", users: "64K", growth: "+2.1%", growthNum: 2.1, trend: "stable", verified: true, badge: undefined },
  { id: "dispatch-labs", rank: 13, prevRank: 99, name: "Dispatch Labs", category: "Infrastructure", tvl: "—", tvlNum: 0, volume24h: "—", users: "50K", growth: "—", growthNum: 0, trend: "up", verified: false, badge: "new" },
  { id: "basename", rank: 14, prevRank: 18, name: "Basename", category: "Identity", tvl: "—", tvlNum: 0, volume24h: "$1M", users: "180K", growth: "+64.2%", growthNum: 64.2, trend: "up", verified: true, badge: "rising" },
  { id: "lens-protocol", rank: 15, prevRank: 14, name: "Lens Protocol", category: "Social", tvl: "—", tvlNum: 0, volume24h: "$5M", users: "320K", growth: "+8.1%", growthNum: 8.1, trend: "up", verified: true, badge: undefined },
];

const METRIC_LABELS: Record<Metric, string> = {
  tvl: "TVL",
  volume: "Volume",
  users: "Users",
  growth: "Growth",
};

const CATEGORIES = ["All", "DeFi", "Social", "Infrastructure", "NFT", "Bridges", "Identity", "Governance", "Gaming"];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function RankChange({ entry }: { entry: LeaderboardEntry }) {
  const delta = entry.prevRank - entry.rank; // positive = moved up
  if (delta > 0) return <span className="text-emerald-600 font-label text-xs">▲ {delta}</span>;
  if (delta < 0) return <span className="text-red-500 font-label text-xs">▼ {Math.abs(delta)}</span>;
  return <span className="text-outline font-label text-xs">—</span>;
}

function TrendArrow({ trend }: { trend: LeaderboardEntry["trend"] }) {
  if (trend === "up") return <span className="text-emerald-600 font-label text-sm font-bold">▲</span>;
  if (trend === "down") return <span className="text-red-500 font-label text-sm font-bold">▼</span>;
  return <span className="text-outline font-label text-sm font-bold">—</span>;
}

function Badge({ badge }: { badge: LeaderboardEntry["badge"] }) {
  if (badge === "top") return (
    <span className="text-[9px] font-label font-bold px-1.5 py-0.5 rounded-[2px] bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20 uppercase" style={{ letterSpacing: "0.06em" }}>
      TOP
    </span>
  );
  if (badge === "rising") return (
    <span className="text-[9px] font-label font-bold px-1.5 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase" style={{ letterSpacing: "0.06em" }}>
      RISING
    </span>
  );
  if (badge === "new") return (
    <span className="text-[9px] font-label font-bold px-1.5 py-0.5 rounded-[2px] bg-purple-500/10 text-purple-700 border border-purple-500/20 uppercase" style={{ letterSpacing: "0.06em" }}>
      NEW
    </span>
  );
  return null;
}

function MetricValue({ metric, entry }: { metric: Metric; entry: LeaderboardEntry }) {
  if (metric === "tvl") return <span className="font-label font-semibold text-xs text-on-surface">{entry.tvl}</span>;
  if (metric === "volume") return <span className="font-label font-semibold text-xs text-on-surface">{entry.volume24h}</span>;
  if (metric === "users") return <span className="font-label font-semibold text-xs text-on-surface">{entry.users}</span>;
  if (metric === "growth") {
    const pos = entry.growthNum >= 0;
    return (
      <span className={`font-label font-semibold text-xs ${pos ? "text-emerald-600" : "text-red-500"}`}>
        {entry.growth}
      </span>
    );
  }
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>("tvl");
  const [timeframe, setTimeframe] = useState<Timeframe>("24h");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Sort entries by the active metric
  const sorted = [...ENTRIES]
    .filter((e) => categoryFilter === "All" || e.category === categoryFilter)
    .sort((a, b) => {
      const av = metric === "tvl" ? a.tvlNum : metric === "growth" ? a.growthNum : metric === "volume" ? parseFloat(a.volume24h.replace(/[^0-9.]/g, "")) : parseFloat(a.users.replace(/[^0-9.]/g, ""));
      const bv = metric === "tvl" ? b.tvlNum : metric === "growth" ? b.growthNum : metric === "volume" ? parseFloat(b.volume24h.replace(/[^0-9.]/g, "")) : parseFloat(b.users.replace(/[^0-9.]/g, ""));
      return sortDir === "desc" ? bv - av : av - bv;
    });

  // Re-rank after sort
  const ranked = sorted.map((e, i) => ({ ...e, rank: i + 1 }));

  const metricCols: Record<Metric, string> = {
    tvl: "TVL",
    volume: "24h Volume",
    users: "Users",
    growth: `${timeframe} Growth`,
  };

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">leaderboard</span>
          <span className="font-headline font-black text-base text-on-surface">Leaderboard</span>
          <span className="ml-auto text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>{ENTRIES.length} Ranked</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">Leaderboard</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            Projects ranked by {metricCols[metric].toLowerCase()}
          </p>
        </div>

        {/* ── Timeframe + Sort ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Timeframe */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Period</span>
            <div className="flex gap-1">
              {(["24h", "7d", "30d"] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1.5 text-[11px] font-label font-semibold rounded-[2px] border transition-colors ${
                    timeframe === tf
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
                  }`}
                  style={{ letterSpacing: "0.06em" }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Sort direction */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Sort</span>
            <button
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              className="px-2.5 py-1.5 text-[11px] font-label font-semibold rounded-[2px] border border-outline-variant bg-surface text-on-surface-variant hover:border-primary/40 transition-colors flex items-center gap-1"
            >
              <span>{sortDir === "desc" ? "High → Low" : "Low → High"}</span>
              <span className="material-symbols-outlined text-base leading-none">
                {sortDir === "desc" ? "arrow_downward" : "arrow_upward"}
              </span>
            </button>
          </div>
        </div>

        {/* ── Metric selector (tab row) ──────────────────────────────── */}
        <div className="flex border-b border-outline-variant overflow-x-auto">
          {(["tvl", "volume", "users", "growth"] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-4 py-2.5 text-xs font-label font-semibold uppercase border-b-2 transition-colors whitespace-nowrap ${
                metric === m
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
              style={{ letterSpacing: "0.08em" }}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>

        {/* ── Category filter ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-[11px] font-label font-semibold rounded-[2px] border transition-colors ${
                categoryFilter === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
              }`}
              style={{ letterSpacing: "0.05em" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Results ────────────────────────────────────────────────── */}
        <div className="text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
          {ranked.length} project{ranked.length !== 1 ? "s" : ""} · Ranked by {metricCols[metric]}
        </div>

        {/* ── Leaderboard table ──────────────────────────────────────── */}
        <div className="border border-outline-variant rounded-[2px] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_100px_100px_80px_60px] gap-2 px-4 py-2 bg-surface-container">
            <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.07em" }}>#</span>
            <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.07em" }}>Project</span>
            <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>TVL</span>
            <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Trend</span>
            <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>{metricCols[metric]}</span>
            <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Change</span>
          </div>

          {ranked.map((entry, i) => (
            <div key={entry.id}
                 className={`grid grid-cols-[40px_1fr_100px_100px_80px_60px] gap-2 px-4 py-3 items-center hover:bg-surface-container-low transition-colors ${
                   i > 0 ? "border-t border-outline-variant/40" : ""
                 } ${entry.rank <= 3 ? "bg-primary/[0.02]" : ""}`}>

              {/* Rank */}
              <div className="flex items-center justify-center gap-1">
                <span className={`font-headline font-black text-base leading-none ${
                  entry.rank === 1 ? "text-amber-500" : entry.rank === 2 ? "text-slate-400" : entry.rank === 3 ? "text-amber-700" : "text-outline/60"
                }`}>
                  {entry.rank}
                </span>
                <RankChange entry={entry} />
              </div>

              {/* Name */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label font-semibold text-xs text-on-surface truncate">
                      {entry.name}
                    </span>
                    {entry.verified && (
                      <span className="material-symbols-outlined text-primary text-xs leading-none flex-shrink-0">verified</span>
                    )}
                    <Badge badge={entry.badge} />
                  </div>
                  <span className="font-label text-[10px] text-outline uppercase" style={{ letterSpacing: "0.05em" }}>
                    {entry.category}
                  </span>
                </div>
              </div>

              {/* TVL */}
              <span className="font-label text-xs text-on-surface-variant text-right">{entry.tvl}</span>

              {/* Trend */}
              <div className="flex items-center justify-end gap-1">
                <TrendArrow trend={entry.trend} />
              </div>

              {/* Active metric value */}
              <div className="text-right">
                <MetricValue metric={metric} entry={entry} />
              </div>

              {/* 24h change */}
              <div className="text-right">
                <span className={`font-label text-xs font-semibold ${entry.growthNum >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {entry.growthNum >= 0 ? "+" : ""}{entry.growthNum.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Top 3 podium ─────────────────────────────────────────────── */}
        <section>
          <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
            Top 3 · {METRIC_LABELS[metric]}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 0, 2].map((offset) => {
              // offset 0 = 1st (ranked[0]), offset 1 = 2nd (ranked[1]), offset 2 = 3rd (ranked[2])
              const heights = ["h-24", "h-20", "h-16"];
              const entry = ranked[offset];
              const medals = ["text-amber-400", "text-slate-300", "text-amber-600"];
              return (
                <div key={offset}
                     className={`border border-outline-variant rounded-[2px] bg-surface-container-lowest p-4 flex flex-col gap-2 ${heights[offset]}`}
                     style={{ borderTop: `3px solid ${offset === 0 ? "#f59e0b" : offset === 1 ? "#9ca3af" : "#d97706"}` }}>
                  <div className="flex items-start justify-between">
                    <span className={`font-headline font-black text-2xl leading-none ${medals[offset]}`}>
                      #{entry.rank}
                    </span>
                    <span className="material-symbols-outlined text-base leading-none text-outline">
                      {offset === 0 ? "emoji_events" : offset === 1 ? "workspace_premium" : "military_tech"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-auto">
                    <span className="font-label font-bold text-xs text-on-surface truncate">{entry.name}</span>
                    <MetricValue metric={metric} entry={entry} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Rankings based on on-chain data and user activity</span>
          <span>Updated every 60s</span>
        </footer>
      </div>
    </main>
  );
}
