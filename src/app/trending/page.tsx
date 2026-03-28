"use client";

/**
 * Trending — /trending
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: number; // percent
  volume24h: string;
  marketCap: string;
  category: string;
  logo: string;
}

interface TrendingProject {
  id: string;
  name: string;
  category: string;
  change: number;
  reason: string;
  activity: "surge" | "new" | "viral";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TOKENS: TrendingToken[] = [
  { id: "degen", name: "Degen", symbol: "DEGEN", price: "$0.0284", change24h: 18.4, volume24h: "$42M", marketCap: "$284M", category: "Meme", logo: "D" },
  { id: "aerodrome", name: "Aerodrome", symbol: "AERO", price: "$1.84", change24h: 12.2, volume24h: "$98M", marketCap: "$1.2B", category: "DeFi", logo: "A" },
  { id: "friend-tech", name: "Friend.tech", symbol: "FRIEND", price: "$4.12", change24h: 9.8, volume24h: "$24M", marketCap: "$412M", category: "Social", logo: "F" },
  { id: "poolshark", name: "Poolshark", symbol: "PSB", price: "$2.34", change24h: 7.1, volume24h: "$18M", marketCap: "$89M", category: "DeFi", logo: "P" },
  { id: "based-agent", name: "Based Agent", symbol: "BAGENT", price: "$0.184", change24h: 34.2, volume24h: "$8M", marketCap: "$18M", category: "AI", logo: "B" },
  { id: "stablecoin-usdc", name: "USDC", symbol: "USDC", price: "$1.00", change24h: 0.02, volume24h: "$842M", marketCap: "$42B", category: "Stablecoin", logo: "$" },
  { id: "usdb", name: "USDB", symbol: "USDB", price: "$1.00", change24h: -0.01, volume24h: "$312M", marketCap: "$3.8B", category: "Stablecoin", logo: "$" },
  { id: "sound", name: "Sound", symbol: "SOUND", price: "$0.82", change24h: -4.2, volume24h: "$3M", marketCap: "$82M", category: "NFT", logo: "S" },
];

const TRENDING_PROJECTS: TrendingProject[] = [
  { id: "pike", name: "Pike", category: "DeFi", change: 240, reason: "10x TVL growth in 7 days after new vault launch", activity: "surge" },
  { id: "dispatch", name: "Dispatch Labs", category: "Infrastructure", change: 180, reason: "Testnet launched — 50K active wallets in week 1", activity: "new" },
  { id: "friend-tech-2", name: "Friend.tech v2", category: "Social", change: 95, reason: "Protocol fee reduction drives renewed trading activity", activity: "surge" },
  { id: "sound-protocol", name: "Sound Protocol", category: "NFT", change: 72, reason: "Major artist drop: 4,200 ETH volume in 48 hours", activity: "viral" },
  { id: "grid-racing", name: "Grid Racing", category: "Gaming", change: 64, reason: "Prediction markets on esports going viral on Twitter", activity: "viral" },
  { id: "chainstate", name: "ChainState", category: "Governance", change: 48, reason: "Featured in Coinbase Ventures portfolio update", activity: "new" },
];

const TIMEFRAMES = ["1H", "24H", "7D", "30D"] as const;
type Timeframe = typeof TIMEFRAMES[number];

const ACTIVITY_BADGE: Record<TrendingProject["activity"], { label: string; cls: string }> = {
  surge: { label: "SURGE", cls: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  new: { label: "NEW", cls: "text-[#0052FF] bg-primary/10 border-primary/20" },
  viral: { label: "VIRAL", cls: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function ChangeArrow({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span className={`font-label font-bold text-sm ${positive ? "text-emerald-600" : "text-red-500"}`}>
      {positive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrendingPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("24H");
  const [tokenFilter, setTokenFilter] = useState<string>("All");

  const categories = ["All", "DeFi", "Meme", "Social", "AI", "NFT", "Stablecoin", "Gaming"];
  const filteredTokens = tokenFilter === "All"
    ? TOKENS
    : TOKENS.filter((t) => t.category === tokenFilter);

  // Simulate different timeframes
  const multiplier: Record<Timeframe, number> = { "1H": 0.4, "24H": 1, "7D": 2.8, "30D": 4.1 };
  const volMultiplier = multiplier[timeframe];

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">trending_up</span>
          <span className="font-headline font-black text-base text-on-surface">Trending</span>
          <span className="ml-auto text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Live</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">Trending</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            Top gainers · Trending tokens · Recent activity
          </p>
        </div>

        {/* ── Timeframe selector ──────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Period</span>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-[11px] font-label font-semibold rounded-[2px] border transition-colors ${
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

        {/* ── Trending projects ───────────────────────────────────────── */}
        <section>
          <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
            Hot Projects · {timeframe}
          </h2>
          <div className="flex flex-col gap-2">
            {TRENDING_PROJECTS.map((proj, i) => {
              const badge = ACTIVITY_BADGE[proj.activity];
              return (
                <div key={proj.id}
                     className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-4 flex items-start gap-3 hover:border-primary/30 transition-colors">
                  {/* Rank */}
                  <span className="font-headline font-black text-lg text-outline/60 leading-none flex-shrink-0 w-6 text-center">
                    #{i + 1}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-headline font-black text-sm text-on-surface">{proj.name}</h3>
                      <span className="text-[10px] font-label text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-outline-variant/50">
                        {proj.category}
                      </span>
                      <span className={`text-[10px] font-label px-1.5 py-0.5 border rounded-[2px] font-semibold ${badge.cls}`}
                            style={{ letterSpacing: "0.07em" }}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs font-body text-on-surface-variant leading-relaxed">{proj.reason}</p>
                  </div>

                  {/* Change */}
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <ChangeArrow change={proj.change} />
                    <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.05em" }}>
                      {timeframe}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Tokens ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
            Tokens · {timeframe}
          </h2>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setTokenFilter(cat)}
                className={`px-2 py-1 text-[10px] font-label font-semibold rounded-[2px] border transition-colors ${
                  tokenFilter === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
                }`}
                style={{ letterSpacing: "0.06em" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Token table */}
          <div className="border border-outline-variant rounded-[2px] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_100px_100px_80px] gap-2 px-4 py-2 bg-surface-container">
              <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.07em" }}>Token</span>
              <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Price</span>
              <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>{timeframe}</span>
              <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Volume</span>
              <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Mkt Cap</span>
            </div>

            {/* Rows */}
            {filteredTokens.map((token, i) => (
              <div key={token.id}
                   className={`grid grid-cols-[1fr_80px_100px_100px_80px] gap-2 px-4 py-3 items-center hover:bg-surface-container-low transition-colors ${
                     i > 0 ? "border-t border-outline-variant/40" : ""
                   }`}>
                {/* Name */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[2px] bg-surface-container flex items-center justify-center flex-shrink-0 border border-outline-variant">
                    <span className="font-label font-bold text-xs text-on-surface-variant">{token.logo}</span>
                  </div>
                  <div>
                    <span className="font-label font-semibold text-xs text-on-surface block">{token.name}</span>
                    <span className="font-label text-[10px] text-outline uppercase" style={{ letterSpacing: "0.05em" }}>{token.symbol}</span>
                  </div>
                </div>

                {/* Price */}
                <span className="font-label font-semibold text-xs text-on-surface text-right">{token.price}</span>

                {/* Change */}
                <div className="text-right">
                  <ChangeArrow change={token.change24h} />
                </div>

                {/* Volume */}
                <span className="font-label text-xs text-on-surface-variant text-right">
                  {token.volume24h}
                </span>

                {/* Market cap */}
                <span className="font-label text-xs text-on-surface-variant text-right">
                  {token.marketCap}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Price data from on-chain + DEX aggregators</span>
          <span>Updated every 60s</span>
        </footer>
      </div>
    </main>
  );
}
