"use client";

/**
 * Terminal / Launch Map View — /terminal
 * Figma: Launch Map View — Frame 2041:1270
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LaunchProject {
  id: string;
  name: string;
  tagline: string;
  stage: "idea" | "building" | "testnet" | "mainnet" | "migrating";
  category: string;
  launchDate: string;
  status: "live" | "upcoming" | "graduated";
  chain: string;
  twitter: string;
  website: string;
  description: string;
  milestones: string[];
}

interface MapRegion {
  id: string;
  label: string;
  color: string;
  count: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const REGIONS: MapRegion[] = [
  { id: "defi", label: "DeFi Frontier", color: "#003ec7", count: 24 },
  { id: "social", label: "Social Layer", color: "#7c3aed", count: 18 },
  { id: "infra", label: "Infrastructure Core", color: "#059669", count: 31 },
  { id: "nft", label: "NFT District", color: "#db2777", count: 14 },
  { id: "gaming", label: "Gaming Zone", color: "#ea580c", count: 9 },
  { id: "dao", label: "Governance Grid", color: "#d97706", count: 7 },
];

const LAUNCHES: LaunchProject[] = [
  {
    id: "sound-protocol",
    name: "Sound Protocol",
    tagline: "On-chain music ownership",
    stage: "mainnet",
    category: "NFT",
    launchDate: "Live",
    status: "live",
    chain: "Base",
    twitter: "@soundprotocol",
    website: "sound.xyz",
    description: "Music NFTs with creator-owned royalties. Artists mint audio NFTs with customizable royalty splits.",
    milestones: ["Artist dashboard", "Secondary marketplace", "Royalty enforcement on-chain"],
  },
  {
    id: "dispatch-labs",
    name: "Dispatch Labs",
    tagline: "Decentralized messaging infrastructure",
    stage: "testnet",
    category: "Infrastructure",
    launchDate: "Q2 2026",
    status: "upcoming",
    chain: "Base + Ethereum",
    twitter: "@dispatchlabs",
    website: "dispatch.xyz",
    description: "Push notification and message routing layer for on-chain applications. Uses account abstraction.",
    milestones: ["Testnet launch", "SDK beta", "Mainnet Q2"],
  },
  {
    id: "orbit-finance",
    name: "Orbit Finance",
    tagline: "Structured yield products on Base",
    stage: "mainnet",
    category: "DeFi",
    launchDate: "Live",
    status: "live",
    chain: "Base",
    twitter: "@orbitfinance",
    website: "orbitfi.io",
    description: "Lending and structured yield vaults targeting institutional and retail depositors with fixed-rate products.",
    milestones: ["Fixed-rate lending", "Yield vaults", "Delta-neutral strategies"],
  },
  {
    id: "republica",
    name: "Republica",
    tagline: "Decentralized social for LatAm",
    stage: "building",
    category: "Social",
    launchDate: "Q3 2026",
    status: "upcoming",
    chain: "Base",
    twitter: "@republica_hq",
    website: "republica.social",
    description: "Twitter-like decentralized social platform targeting LatAm markets with local payment rails.",
    milestones: ["Alpha invite", "Community token", "P2P payments integration"],
  },
  {
    id: "chainstate",
    name: "ChainState",
    tagline: "On-chain analytics for DAOs",
    stage: "testnet",
    category: "Governance",
    launchDate: "Q2 2026",
    status: "upcoming",
    chain: "Base + 8 chains",
    twitter: "@chainstate",
    website: "chainstate.io",
    description: "Treasury analytics, voter behavior tracking, and governance proposals dashboard for multi-chain DAOs.",
    milestones: ["DAO dashboard", "Treasury visualization", "Multi-chain support"],
  },
  {
    id: "grid-racing",
    name: "Grid Racing",
    tagline: "On-chain prediction markets",
    stage: "building",
    category: "Gaming",
    launchDate: "Q4 2026",
    status: "upcoming",
    chain: "Base",
    twitter: "@gridracing",
    website: "gridracing.io",
    description: "Prediction market protocol for esports and real-world events. Liquidity providers earn yield on markets.",
    milestones: ["Esports markets", "Sports feeds", "Mobile app"],
  },
];

const STAGE_LABELS: Record<LaunchProject["stage"], string> = {
  idea: "IDEA",
  building: "BUILDING",
  testnet: "TESTNET",
  mainnet: "MAINNET",
  migrating: "MIGRATING",
};

const STAGE_COLORS: Record<LaunchProject["stage"], string> = {
  idea: "text-outline bg-outline/10 border-outline/20",
  building: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  testnet: "text-[#0052FF] bg-primary/10 border-primary/20",
  mainnet: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  migrating: "text-purple-600 bg-purple-500/10 border-purple-500/20",
};

const STATUS_BADGE: Record<LaunchProject["status"], { label: string; cls: string }> = {
  live: { label: "LIVE", cls: "text-emerald-600 bg-emerald-500/10" },
  upcoming: { label: "UPCOMING", cls: "text-[#0052FF] bg-primary/10" },
  graduated: { label: "GRADUATED", cls: "text-amber-600 bg-amber-500/10" },
};

// ─── Map region node ──────────────────────────────────────────────────────────

function MapNode({ region, selected, onClick }: { region: MapRegion; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 p-3 rounded-[2px] border transition-all cursor-pointer ${
        selected
          ? "border-primary bg-primary/10 scale-105"
          : "border-outline-variant bg-surface-container-lowest hover:border-primary/40"
      }`}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-label font-bold text-white"
        style={{ backgroundColor: region.color }}
      >
        {region.count}
      </div>
      <span className="text-[10px] font-label text-on-surface-variant uppercase text-center leading-tight"
            style={{ letterSpacing: "0.05em" }}>
        {region.label}
      </span>
    </button>
  );
}

// ─── Launch card ─────────────────────────────────────────────────────────────

function LaunchCard({ project }: { project: LaunchProject }) {
  const stageCls = STAGE_COLORS[project.stage];
  const statusBadge = STATUS_BADGE[project.status];

  return (
    <div className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-4 flex flex-col gap-3 hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <h3 className="font-headline font-black text-sm text-on-surface truncate">
              {project.name}
            </h3>
            <span className={`text-[9px] font-label px-1.5 py-0.5 border rounded-[2px] ${statusBadge.cls}`}
                  style={{ letterSpacing: "0.08em" }}>
              {statusBadge.label}
            </span>
          </div>
          <p className="text-[11px] font-body text-on-surface-variant leading-snug">
            {project.tagline}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className={`text-[10px] font-label px-2 py-0.5 border rounded-[2px] font-semibold ${stageCls}`}
                style={{ letterSpacing: "0.07em" }}>
            {STAGE_LABELS[project.stage]}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs font-body text-on-surface-variant leading-relaxed">
        {project.description}
      </p>

      {/* Chain & Date */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-xs leading-none">link</span>
          <span className="text-[10px] font-label text-on-surface-variant">{project.website}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-xs leading-none">calendar_today</span>
          <span className="text-[10px] font-label text-on-surface-variant">{project.launchDate}</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="pt-2 border-t border-outline-variant/40 flex flex-col gap-1">
        <span className="text-[10px] font-label text-outline uppercase mb-1" style={{ letterSpacing: "0.07em" }}>
          Roadmap
        </span>
        <div className="flex flex-wrap gap-1">
          {project.milestones.map((m) => (
            <span key={m}
                  className="text-[10px] font-label text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-outline-variant/50">
              → {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function TerminalPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<LaunchProject["stage"] | "all">("all");
  const [filterStatus, setFilterStatus] = useState<LaunchProject["status"] | "all">("all");

  const filteredLaunches = LAUNCHES.filter((p) => {
    const stageOk = filterStage === "all" || p.stage === filterStage;
    const statusOk = filterStatus === "all" || p.status === filterStatus;
    const regionOk = selectedRegion === null || p.category.toLowerCase() === selectedRegion;
    return stageOk && statusOk && regionOk;
  });

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">
            map
          </span>
          <span className="font-headline font-black text-base text-on-surface">
            Launch Map
          </span>
          <span className="ml-auto text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            {LAUNCHES.length} Projects
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">
            Launch Map
          </h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            Track projects from idea → mainnet on Base
          </p>
        </div>

        {/* ── Region map ───────────────────────────────────────────────── */}
        <section>
          <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
            Ecosystem Regions
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {REGIONS.map((region) => (
              <MapNode
                key={region.id}
                region={region}
                selected={selectedRegion === region.id}
                onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
              />
            ))}
          </div>
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="mt-2 text-[10px] font-label text-primary uppercase hover:underline"
              style={{ letterSpacing: "0.06em" }}
            >
              Clear region filter
            </button>
          )}
        </section>

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-4">
          {/* Stage filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Stage</span>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "idea", "building", "testnet", "mainnet", "migrating"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className={`px-2 py-1 text-[10px] font-label font-semibold rounded-[2px] border transition-colors ${
                    filterStage === s
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
                  }`}
                  style={{ letterSpacing: "0.06em" }}
                >
                  {s === "all" ? "All" : STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>Status</span>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "live", "upcoming", "graduated"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2 py-1 text-[10px] font-label font-semibold rounded-[2px] border transition-colors ${
                    filterStatus === s
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
                  }`}
                  style={{ letterSpacing: "0.06em" }}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stage timeline ───────────────────────────────────────────── */}
        <section>
          <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
            Launch Pipeline
          </h2>
          <div className="flex items-center gap-0 overflow-x-auto">
            {(["idea", "building", "testnet", "mainnet", "migrating"] as LaunchProject["stage"][]).map((stage, i) => {
              const count = LAUNCHES.filter((p) => p.stage === stage).length;
              return (
                <div key={stage} className="flex items-center">
                  <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-[2px] border border-outline-variant min-w-[72px] ${
                    filterStage === stage ? "bg-primary/10 border-primary" : "bg-surface-container-lowest"
                  }`}>
                    <span className="text-[10px] font-label text-outline uppercase" style={{ letterSpacing: "0.07em" }}>
                      {STAGE_LABELS[stage]}
                    </span>
                    <span className="text-lg font-headline font-black text-on-surface leading-none">
                      {count}
                    </span>
                  </div>
                  {i < 4 && (
                    <div className="w-6 h-px bg-outline-variant flex-shrink-0 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Results count ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            {filteredLaunches.length} project{filteredLaunches.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-label text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            Sorted by: Recent Activity
          </span>
        </div>

        {/* ── Launch grid ──────────────────────────────────────────────── */}
        {filteredLaunches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredLaunches.map((project) => (
              <LaunchCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-outline-variant rounded-[2px] p-12 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-5xl text-outline/40 leading-none">explore_off</span>
            <p className="font-headline font-black text-base text-on-surface">No projects match filters</p>
            <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.06em" }}>
              Try adjusting region or stage filters
            </p>
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Launch data from on-chain deployments + project submissions</span>
          <span>Updated daily</span>
        </footer>
      </div>
    </main>
  );
}
