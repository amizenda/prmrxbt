"use client";

/**
 * Categories — /categories
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  tvl: string;
  volume24h: string;
  color: string;
  icon: string;
  featured: string[]; // project names
}

interface CategoryProject {
  name: string;
  description: string;
  tvl: string;
  verified: boolean;
  trending: "hot" | "new" | null;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: "defi",
    name: "DeFi",
    description: "Decentralized exchanges, lending protocols, yield optimizers, and structured products.",
    projectCount: 89,
    tvl: "$3.2B",
    volume24h: "$1.4B",
    color: "#003ec7",
    icon: "analytics",
    featured: ["Uniswap V4", "Aerodrome", "BaseSwap", "Orbit Finance"],
  },
  {
    id: "social",
    name: "Social",
    description: "Decentralized social graphs, content platforms, creator monetization, and social trading.",
    projectCount: 34,
    tvl: "—",
    volume24h: "$28M",
    color: "#7c3aed",
    icon: "forum",
    featured: ["Friend.tech", "Lens Protocol", "Republica", "Paragraph"],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Tooling, SDKs, oracles, data indexing, account abstraction, and developer primitives.",
    projectCount: 61,
    tvl: "—",
    volume24h: "—",
    color: "#059669",
    icon: "dns",
    featured: ["thirdweb", "Pimlico", "Dispatch Labs", "The Graph"],
  },
  {
    id: "nft",
    name: "NFT",
    description: "Marketplaces, generative art, music NFTs, gaming assets, and on-chain collectibles.",
    projectCount: 47,
    tvl: "—",
    volume24h: "$14M",
    color: "#db2777",
    icon: "palette",
    featured: ["Sound Protocol", "Mint House", "Zora", "Foundation"],
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "On-chain games, prediction markets, gamefi economies, and virtual worlds.",
    projectCount: 28,
    tvl: "$124M",
    volume24h: "$8M",
    color: "#ea580c",
    icon: "sports_esports",
    featured: ["Grid Racing", "Loot Realms", "Arcade Kingdoms"],
  },
  {
    id: "governance",
    name: "Governance",
    description: "DAOs, voting systems, treasury management, and on-chain governance tooling.",
    projectCount: 18,
    tvl: "$89M",
    volume24h: "$4M",
    color: "#d97706",
    icon: "how_to_vote",
    featured: ["Base DAO", "ChainState", "Tally"],
  },
  {
    id: "bridges",
    name: "Bridges",
    description: "Cross-chain bridges, token bridges, message passing protocols, and interoperability.",
    projectCount: 22,
    tvl: "$612M",
    volume24h: "$842M",
    color: "#0891b2",
    icon: "sync_alt",
    featured: ["Across", "Stargate", "Hop Protocol", "Base Bridge"],
  },
  {
    id: "identity",
    name: "Identity",
    description: "ENS, domain names, reputation systems, soulbound tokens, and identity primitives.",
    projectCount: 15,
    tvl: "—",
    volume24h: "—",
    color: "#65a30d",
    icon: "badge",
    featured: ["Basename", "Worldcoin", "Gitcoin Passport"],
  },
];

// ─── Featured projects per category (detail view) ─────────────────────────────

const CATEGORY_PROJECTS: Record<string, CategoryProject[]> = {
  defi: [
    { name: "Uniswap V4", description: "AMM with hooks and custom pool logic", tvl: "$842M", verified: true, trending: "hot" },
    { name: "Aerodrome", description: "Base native DEX and liquidity hub", tvl: "$284M", verified: true, trending: "hot" },
    { name: "BaseSwap", description: "Multi-chain DEX on Base with low fees", tvl: "$156M", verified: true, trending: null },
    { name: "Orbit Finance", description: "Structured yield products", tvl: "$98M", verified: false, trending: "new" },
    { name: "Poolshark", description: "Concentrated liquidity + limit orders", tvl: "$89M", verified: false, trending: null },
    { name: "Mimatic", description: "Cross-chain yield optimizer", tvl: "$67M", verified: false, trending: null },
  ],
  social: [
    { name: "Friend.tech", description: "Social trading via key-based access", tvl: "—", verified: true, trending: "hot" },
    { name: "Lens Protocol", description: "Composable decentralized social graph", tvl: "—", verified: true, trending: "new" },
    { name: "Paragraph", description: "Curated newsletter platform", tvl: "—", verified: true, trending: null },
    { name: "Republica", description: "Decentralized social for LatAm", tvl: "—", verified: false, trending: "new" },
  ],
  infrastructure: [
    { name: "thirdweb", description: "Web3 SDK for building dapps", tvl: "—", verified: true, trending: "hot" },
    { name: "Pimlico", description: "ERC-4337 bundler and paymaster infra", tvl: "—", verified: true, trending: "hot" },
    { name: "Dispatch Labs", description: "Decentralized messaging infra", tvl: "—", verified: false, trending: "new" },
    { name: "The Graph", description: "Blockchain data indexing", tvl: "—", verified: true, trending: null },
  ],
  nft: [
    { name: "Sound Protocol", description: "On-chain music ownership", tvl: "—", verified: false, trending: "hot" },
    { name: "Mint House", description: "Curated digital collectibles", tvl: "—", verified: true, trending: "hot" },
    { name: "Zora", description: "Creator-focused NFT protocol", tvl: "—", verified: true, trending: null },
    { name: "Foundation", description: "Auction-based NFT marketplace", tvl: "—", verified: true, trending: null },
  ],
  gaming: [
    { name: "Grid Racing", description: "On-chain prediction markets", tvl: "—", verified: false, trending: "new" },
    { name: "Loot Realms", description: "On-chain strategy game", tvl: "$42M", verified: true, trending: null },
    { name: "Arcade Kingdoms", description: "Web3 arcade games", tvl: "—", verified: false, trending: null },
  ],
  governance: [
    { name: "Base DAO", description: "Decentralized governance on Base", tvl: "$34M", verified: false, trending: null },
    { name: "ChainState", description: "DAO treasury analytics", tvl: "—", verified: false, trending: "new" },
    { name: "Tally", description: "Governance dashboard", tvl: "—", verified: true, trending: null },
  ],
  bridges: [
    { name: "Across", description: "Fast cross-chain bridge", tvl: "$312M", verified: true, trending: "hot" },
    { name: "Stargate", description: "Omnichain liquidity protocol", tvl: "$189M", verified: true, trending: null },
    { name: "Hop Protocol", description: "Scalable token bridges", tvl: "$78M", verified: true, trending: null },
    { name: "Base Bridge", description: "Official Base bridge", tvl: "$34M", verified: true, trending: null },
  ],
  identity: [
    { name: "Basename", description: "Human-readable Base names", tvl: "—", verified: true, trending: "hot" },
    { name: "Worldcoin", description: "Proof of personhood", tvl: "—", verified: true, trending: null },
    { name: "Gitcoin Passport", description: " Sybil-resistant identity", tvl: "—", verified: true, trending: null },
  ],
};

// ─── Category card ─────────────────────────────────────────────────────────────

function CategoryCard({ category, selected, onClick }: { category: Category; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-[2px] border transition-all ${
        selected
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-outline-variant bg-surface-container-lowest hover:border-primary/40"
      }`}
    >
      {/* Icon + name row */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-[2px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}15`, border: `1px solid ${category.color}30` }}
        >
          <span className="material-symbols-outlined text-lg leading-none" style={{ color: category.color }}>
            {category.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-headline font-black text-base text-on-surface leading-tight mb-0.5">
            {category.name}
          </h3>
          <p className="font-label text-[10px] text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            {category.projectCount} PROJECTS
          </p>
        </div>
        <span
          className="material-symbols-outlined text-base leading-none flex-shrink-0 transition-transform"
          style={{ color: selected ? category.color : "var(--color-outline)", transform: selected ? "rotate(180deg)" : "none" }}
        >
          expand_more
        </span>
      </div>

      {/* Description */}
      <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-3">
        {category.description}
      </p>

      {/* Stats row */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.06em" }}>TVL</span>
          <span className="text-xs font-label font-semibold text-on-surface">{category.tvl}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.06em" }}>24h Vol</span>
          <span className="text-xs font-label font-semibold text-on-surface">{category.volume24h}</span>
        </div>
      </div>

      {/* Featured projects */}
      {selected && (
        <div className="mt-3 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-1">
          {category.featured.map((name) => (
            <span key={name}
                  className="text-[10px] font-label text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-outline-variant/50">
              {name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selected = CATEGORIES.find((c) => c.id === selectedCategory);
  const projects = selected ? (CATEGORY_PROJECTS[selected.id] ?? []) : [];

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">grid_view</span>
          <span className="font-headline font-black text-base text-on-surface">Categories</span>
          <span className="ml-auto text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            {CATEGORIES.length} Categories
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">Categories</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            Browse the Base ecosystem by vertical
          </p>
        </div>

        {/* ── Category grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            />
          ))}
        </div>

        {/* ── Selected category detail ────────────────────────────────── */}
        {selected && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="material-symbols-outlined text-lg leading-none"
                style={{ color: selected.color }}
              >
                {selected.icon}
              </span>
              <h2 className="font-headline font-black text-base text-on-surface">
                {selected.name} Projects
              </h2>
              <span className="text-xs font-label text-outline uppercase ml-auto" style={{ letterSpacing: "0.06em" }}>
                {projects.length} projects
              </span>
            </div>

            <div className="border border-outline-variant rounded-[2px] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_80px_60px] gap-2 px-4 py-2 bg-surface-container">
                <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.07em" }}>Project</span>
                <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>TVL</span>
                <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Status</span>
                <span className="text-[10px] font-label text-outline uppercase text-right" style={{ letterSpacing: "0.07em" }}>Type</span>
              </div>

              {projects.map((proj, i) => (
                <div key={proj.name}
                     className={`grid grid-cols-[1fr_80px_80px_60px] gap-2 px-4 py-3 items-center hover:bg-surface-container-low transition-colors ${
                       i > 0 ? "border-t border-outline-variant/40" : ""
                     }`}>
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    <span className="font-label font-semibold text-xs text-on-surface">{proj.name}</span>
                    {proj.verified && (
                      <span className="material-symbols-outlined text-primary text-xs leading-none">verified</span>
                    )}
                  </div>

                  {/* TVL */}
                  <span className="font-label text-xs text-on-surface-variant text-right">{proj.tvl}</span>

                  {/* Trending */}
                  <div className="text-right">
                    {proj.trending === "hot" && (
                      <span className="text-[10px] font-label font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-[2px] uppercase" style={{ letterSpacing: "0.06em" }}>
                        HOT
                      </span>
                    )}
                    {proj.trending === "new" && (
                      <span className="text-[10px] font-label font-bold text-[#0052FF] bg-primary/10 px-1.5 py-0.5 rounded-[2px] uppercase" style={{ letterSpacing: "0.06em" }}>
                        NEW
                      </span>
                    )}
                    {proj.trending === null && (
                      <span className="text-[10px] font-label text-outline">—</span>
                    )}
                  </div>

                  {/* Verified */}
                  <div className="text-right">
                    {proj.verified ? (
                      <span className="material-symbols-outlined text-emerald-600 text-base leading-none">check_circle</span>
                    ) : (
                      <span className="text-[10px] font-label text-outline">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Data from on-chain + project submissions</span>
          <span>Updated daily</span>
        </footer>
      </div>
    </main>
  );
}
