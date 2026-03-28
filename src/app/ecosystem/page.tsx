"use client";

/**
 * Ecosystem Directory — /ecosystem
 * Figma: Ecosystem Directory — Frame 2041:905
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  logo: string;
  tvl: string;
  volume24h: string;
  users: string;
  trend: "up" | "down" | "neutral";
  tags: string[];
  verified: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: "uniswap-v4",
    name: "Uniswap V4",
    category: "DeFi",
    description: "AMM protocol with hooks and custom pool logic",
    website: "uniswap.org",
    logo: "U",
    tvl: "$842M",
    volume24h: "$312M",
    users: "1.2M",
    trend: "up",
    tags: ["AMM", "DEX", "Hooks"],
    verified: true,
  },
  {
    id: "aerodrome",
    name: "Aerodrome",
    category: "DeFi",
    description: "Base's native DEX and liquidity hub",
    website: "aerodrome.finance",
    logo: "A",
    tvl: "$284M",
    volume24h: "$98M",
    users: "340K",
    trend: "up",
    tags: ["DEX", "Stablecoin"],
    verified: true,
  },
  {
    id: "baseswap",
    name: "BaseSwap",
    category: "DeFi",
    description: "Multi-chain DEX on Base with low fees",
    website: "baseswap.fi",
    logo: "B",
    tvl: "$156M",
    volume24h: "$67M",
    users: "210K",
    trend: "up",
    tags: ["DEX", "AMM"],
    verified: true,
  },
  {
    id: "poolshark",
    name: "Poolshark",
    category: "DeFi",
    description: "Concentrated liquidity and limit orders",
    website: "poolshark.io",
    logo: "P",
    tvl: "$89M",
    volume24h: "$41M",
    users: "85K",
    trend: "neutral",
    tags: ["Liquidity", "Perp"],
    verified: false,
  },
  {
    id: "mimatic",
    name: "Mimatic",
    category: "DeFi",
    description: "Cross-chain yield optimizer",
    website: "mimo/defi",
    logo: "M",
    tvl: "$67M",
    volume24h: "$18M",
    users: "42K",
    trend: "down",
    tags: ["Yield", "Bridge"],
    verified: false,
  },
  {
    id: "friendtech",
    name: "Friend.tech",
    category: "Social",
    description: "Social trading on Base with key-based access",
    website: "friend.tech",
    logo: "F",
    tvl: "—",
    volume24h: "$24M",
    users: "890K",
    trend: "up",
    tags: ["Social", "Trading"],
    verified: true,
  },
  {
    id: "lens-protocol",
    name: "Lens Protocol",
    category: "Social",
    description: "Composable, decentralized social graph",
    website: "lens.xyz",
    logo: "L",
    tvl: "—",
    volume24h: "$5M",
    users: "320K",
    trend: "neutral",
    tags: ["Social Graph", "NFT"],
    verified: true,
  },
  {
    id: "paragraph",
    name: "Paragraph",
    category: "Social",
    description: "Curated newsletter platform on Base",
    website: "paragraph.xyz",
    logo: "P",
    tvl: "—",
    volume24h: "$1M",
    users: "55K",
    trend: "up",
    tags: ["Publishing", "Content"],
    verified: true,
  },
  {
    id: "thirdweb",
    name: "thirdweb",
    category: "Infrastructure",
    description: "Web3 SDK for building dapps",
    website: "thirdweb.com",
    logo: "T",
    tvl: "—",
    volume24h: "—",
    users: "4.2M",
    trend: "up",
    tags: ["SDK", "Tooling"],
    verified: true,
  },
  {
    id: "pimlico",
    name: "Pimlico",
    category: "Infrastructure",
    description: "Bundler and paymaster infrastructure for ERC-4337",
    website: "pimlico.io",
    logo: "P",
    tvl: "—",
    volume24h: "—",
    users: "180K",
    trend: "up",
    tags: ["Account Abstraction", "Bundler"],
    verified: true,
  },
  {
    id: "base-dao",
    name: "Base DAO",
    category: "Governance",
    description: "Decentralized governance framework on Base",
    website: "base-dao.io",
    logo: "B",
    tvl: "$34M",
    volume24h: "$2M",
    users: "12K",
    trend: "neutral",
    tags: ["DAO", "Governance"],
    verified: false,
  },
  {
    id: "mint-house",
    name: "Mint House",
    category: "NFT",
    description: "Curated digital collectibles and drops",
    website: "minthouse.xyz",
    logo: "M",
    tvl: "—",
    volume24h: "$8M",
    users: "92K",
    trend: "up",
    tags: ["NFT", "Drops"],
    verified: true,
  },
];

const CATEGORIES = ["All", "DeFi", "Social", "Infrastructure", "Governance", "NFT", "Gaming"];

// ─── Category badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    DeFi: "bg-[#003ec7]/10 text-[#003ec7] border-[#003ec7]/20",
    Social: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    Infrastructure: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    Governance: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    NFT: "bg-pink-500/10 text-pink-700 border-pink-500/20",
    Gaming: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  };
  const cls = colors[category] ?? "bg-outline/10 text-on-surface-variant border-outline/20";
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-label font-semibold uppercase border rounded-[2px] ${cls}`}
          style={{ letterSpacing: "0.08em" }}>
      {category}
    </span>
  );
}

// ─── Trend indicator ──────────────────────────────────────────────────────────

function TrendArrow({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <span className="text-emerald-600 font-label text-xs">▲ +2.4%</span>;
  if (trend === "down") return <span className="text-red-500 font-label text-xs">▼ −1.1%</span>;
  return <span className="text-outline font-label text-xs">— 0.0%</span>;
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-4 flex flex-col gap-3 transition-colors hover:border-primary/40 cursor-pointer group">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Logo placeholder */}
        <div className="w-9 h-9 rounded-[2px] bg-surface-container flex items-center justify-center flex-shrink-0 border border-outline-variant">
          <span className="font-label font-bold text-sm text-on-surface-variant">
            {project.logo}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-headline font-black text-sm text-on-surface truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            {project.verified && (
              <span className="material-symbols-outlined text-[#0052FF] text-xs leading-none flex-shrink-0" title="Verified">
                verified
              </span>
            )}
          </div>
          <CategoryBadge category={project.category} />
        </div>
        <TrendArrow trend={project.trend} />
      </div>

      {/* Description */}
      <p className="text-xs text-on-surface-variant font-body leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/40">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>TVL</span>
          <span className="text-xs font-label font-semibold text-on-surface">{project.tvl}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>24h Vol</span>
          <span className="text-xs font-label font-semibold text-on-surface">{project.volume24h}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Users</span>
          <span className="text-xs font-label font-semibold text-on-surface">{project.users}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span key={tag}
                className="text-[10px] font-label text-on-surface-variant px-1.5 py-0.5 border border-outline-variant/50 rounded-[2px]">
            #{tag.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EcosystemPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = PROJECTS.filter((p) => {
    const matchesQuery =
      query === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">
            hub
          </span>
          <span className="font-headline font-black text-base text-on-surface">
            Ecosystem
          </span>
          <span className="ml-auto text-xs font-label text-outline">
            {PROJECTS.length} PROJECTS
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">
            Ecosystem Directory
          </h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            Discover and track every project building on Base
          </p>
        </div>

        {/* ── Search ──────────────────────────────────────────────────── */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg leading-none pointer-events-none">
            search
          </span>
          <input
            type="search"
            placeholder="Search projects, categories, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-[2px] text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* ── Category filters ────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-label font-semibold rounded-[2px] border transition-colors ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
                }`}
                style={{ letterSpacing: "0.06em" }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Results count ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            Sorted by: TVL
          </span>
        </div>

        {/* ── Project grid ────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-outline-variant rounded-[2px] p-12 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-5xl text-outline/40 leading-none">
              search_off
            </span>
            <p className="font-headline font-black text-base text-on-surface">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.06em" }}>
              Try a different search term or category
            </p>
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Data sourced from on-chain and Basescan</span>
          <span>Live</span>
        </footer>
      </div>
    </main>
  );
}
