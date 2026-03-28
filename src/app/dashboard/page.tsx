"use client";

/**
 * Dashboard Page — /dashboard
 * Stitch: "App Dashboard & Map" (b96593e35bb14d2cadcaf3fea59aadc2)
 *
 * Layout from Stitch HTML exactly:
 *   - Fixed TopNav (h-14)
 *   - Fixed Sidebar (w-64, lg only)
 *   - Main content area (ml-64, mt-14)
 *     - Sticky search + filter bar
 *     - Ecosystem Map section
 *     - Project card grid
 *     - Leaderboard section
 *     - Project detail drawer (right-side overlay)
 *     - Mobile bottom nav
 *     - Footer
 *
 * Wallet tracking (WT-BE-001, WT-FE-001/002/003, WT-BE-002) preserved:
 *     - WalletInput, WalletStats, WalletActivityFeed in sidebar expand / section
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { EcosystemMap } from "@/components/dashboard/EcosystemMap";
import { ProjectCard, DEMO_PROJECTS } from "@/components/dashboard/ProjectCard";
import type { ProjectCardData } from "@/components/dashboard/ProjectCard";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { ProjectDrawer } from "@/components/dashboard/ProjectDrawer";
import { WalletInput } from "@/components/wallet/WalletInput";
import { WalletStats } from "@/components/wallet/WalletStats";
import { WalletActivityFeed } from "@/components/wallet/WalletActivityFeed";
import type { WalletStats as WalletStatsType } from "@/types/wallet";
import type { DashboardResponse } from "@/types/dashboard";

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function formatWallets(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchWalletPage(
  address: string,
  page: number
): Promise<WalletStatsType> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  const res = await fetch(`/api/wallet/${address}?${params}`);
  if (!res.ok) {
    if (res.status === 400) throw new Error("Invalid wallet address");
    if (res.status === 502) throw new Error("Upstream API unavailable. Please try again.");
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<WalletStatsType>;
}

async function fetchDashboard(): Promise<DashboardResponse> {
  const res = await fetch("/api/dashboard", { next: { revalidate: 120 } });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Dashboard rate limited. Please refresh.");
    throw new Error(`Dashboard load failed (${res.status})`);
  }
  return res.json() as Promise<DashboardResponse>;
}

// ─── Wallet state ─────────────────────────────────────────────────────────────

interface WalletState {
  address: string | null;
  stats: WalletStatsType | null;
  isLoading: boolean;
  error: string | null;
  page: number;
}

const INITIAL_WALLET: WalletState = {
  address: null,
  stats: null,
  isLoading: false,
  error: null,
  page: 1,
};

// ─── Category filter chips (from Stitch HTML) ─────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "defi", label: "DEFI" },
  { id: "ai", label: "AI" },
  { id: "infra", label: "INFRA" },
  { id: "social", label: "SOCIAL" },
];

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = ["SORT: TRENDING", "SORT: NEWEST", "SORT: TVL (HIGH)"];

// ─── Page component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  // ── Wallet state ───────────────────────────────────────────────────────────
  const [walletState, setWalletState] = useState<WalletState>(INITIAL_WALLET);
  const pageRef = useRef(1);
  pageRef.current = walletState.page;

  // ── Dashboard data ─────────────────────────────────────────────────────────
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [walletPanelOpen, setWalletPanelOpen] = useState(false);

  // ── Fetch ecosystem dashboard ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const data = await fetchDashboard();
        if (!cancelled) setDashboard(data);
      } catch (err) {
        if (!cancelled) {
          setDashboardError(
            err instanceof Error ? err.message : "Failed to load ecosystem dashboard"
          );
        }
      } finally {
        if (!cancelled) setDashboardLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Wallet load ─────────────────────────────────────────────────────────────
  const loadWallet = useCallback(async (address: string, page = 1) => {
    // Client-side validation before fetch — fail fast with a clear message
    const ETH_RE = /^0x[0-9a-fA-F]{40}$/;
    if (!ETH_RE.test(address)) {
      setWalletState((s) => ({ ...s, isLoading: false, error: "Invalid Ethereum address format (must be 0x + 40 hex chars)" }));
      return;
    }
    setWalletState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const stats = await fetchWalletPage(address, page);
      setWalletState((s) => ({
        ...s,
        stats,
        address,
        page,
        isLoading: false,
        error: null,
      }));
      setWalletPanelOpen(true);
    } catch (err) {
      setWalletState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, []);

  // ── Load more ──────────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (!walletState.address || walletState.isLoading) return;
    const nextPage = pageRef.current + 1;
    setWalletState((s) => ({ ...s, isLoading: true }));

    fetchWalletPage(walletState.address, nextPage)
      .then((newStats) => {
        setWalletState((s) => {
          if (!s.stats) return s;
          return {
            ...s,
            stats: {
              ...s.stats,
              transactions: [...s.stats.transactions, ...newStats.transactions],
            },
            page: s.page + 1,
            isLoading: false,
          };
        });
      })
      .catch((err) => {
        setWalletState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Load more failed",
        }));
      });
  }, [walletState.address, walletState.isLoading]);

  const hasMore = walletState.stats
    ? walletState.stats.transactions.length < walletState.stats.txCount
    : false;

  // ── Project card selection → open drawer ────────────────────────────────────
  function handleProjectSelect(project: ProjectCardData) {
    setSelectedProject(project);
    setDrawerOpen(true);
  }

  // ── Filter projects by category ─────────────────────────────────────────────
  const filteredProjects = selectedCategory === "all"
    ? DEMO_PROJECTS
    : DEMO_PROJECTS.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  // ── Derived KPIs from dashboard ─────────────────────────────────────────────
  const totalProjects = dashboard?.overview.totalProjects ?? 0;
  const totalVolume = dashboard?.overview.totalVolume24h ?? 0;
  const activeWallets = dashboard?.overview.activeWallets ?? 0;

  return (
    <div className="bg-surface text-on-surface overflow-hidden">
      {/* Fixed top navigation */}
      <TopNav />

      {/* Fixed sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={(id) => {
          setActiveNav(id);
          if (id !== "dashboard") setWalletPanelOpen(false);
        }}
      />

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 lg:hidden bg-white/90 dark:bg-slate-950/90 border-t border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md">
        {[
          { id: "explore", icon: "explore", label: "EXPLORE" },
          { id: "trends", icon: "trending_up", label: "TRENDS" },
          { id: "saved", icon: "bookmark", label: "SAVED" },
          { id: "wallet", icon: "account_balance_wallet", label: "WALLET" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "wallet") setWalletPanelOpen((v) => !v);
            }}
            className={[
              "flex flex-col items-center justify-center p-2 font-mono text-[9px] font-bold uppercase transition-colors",
              item.id === "explore"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-600",
            ].join(" ")}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Project detail drawer */}
      <ProjectDrawer
        project={selectedProject ? {
          id: selectedProject.id,
          name: selectedProject.name,
          ticker: `${selectedProject.ticker} // ${selectedProject.category} HUB`,
          thesis: `${selectedProject.name} is a key protocol within the Base ecosystem, providing ${selectedProject.category.toLowerCase()} services to thousands of daily active users.`,
          metrics: selectedProject.stats.map(([k, v]) => [k, v, false] as [string, string, boolean?]),
          narratives: ["Ecosystem Pillar", "High Conviction", selectedProject.category],
          governance: {
            label: "Community Governed",
            sublabel: "DAO Active",
          },
          dappUrl: "https://aerodrome.finance",
        } : null}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main content canvas */}
      <main className="lg:ml-64 mt-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-surface grid-bg relative">

        {/* ── Sticky search + filter bar ────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-sm border-b border-outline-variant/30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-sm py-2 pl-10 pr-4 font-mono text-xs tracking-tight focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline"
                placeholder="SEARCH PROJECTS BY NAME, TICKER, OR CATEGORY..."
                type="text"
              />
            </div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={[
                    "px-3 py-1.5 font-mono text-[10px] font-bold uppercase rounded-full transition-all",
                    selectedCategory === cat.id
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:border-primary",
                  ].join(" ")}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort select */}
            <div className="w-full md:w-auto">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-sm py-2 px-3 font-mono text-[10px] tracking-tight w-full"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Scrollable content ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">

          {/* ── Ecosystem Map section ────────────────────────────────────── */}
          <section>
            <EcosystemMap
              defiProjectCount={totalProjects > 0 ? totalProjects : 34}
              infraProjectCount={12}
            />
          </section>

          {/* ── Project grid (cards) ─────────────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardLoading && filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-sm overflow-hidden animate-pulse"
              >
                <div className="p-4 border-b border-outline-variant/20">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-surface-container rounded-sm" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-surface-container rounded" />
                      <div className="h-3 w-12 bg-surface-container rounded" />
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-3 w-full bg-surface-container rounded" />
                  <div className="h-3 w-2/3 bg-surface-container rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-surface-container rounded" />
                    <div className="h-10 bg-surface-container rounded" />
                  </div>
                </div>
              </div>
            ))}

            {!dashboardLoading && filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                onSelect={handleProjectSelect}
              />
            ))}
          </section>

          {/* ── Leaderboard section ──────────────────────────────────────── */}
          <section>
            <Leaderboard onViewAll={() => {}} />
          </section>

          {/* ── Wallet panel section ─────────────────────────────────────── */}
          {walletPanelOpen && (
            <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-sm p-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg leading-none">account_balance_wallet</span>
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-on-surface">
                  Wallet Tracker
                </h2>
              </div>

              <WalletInput
                onSubmit={loadWallet}
                initialValue={walletState.address ?? ""}
                isLoading={walletState.isLoading && !!walletState.address}
              />

              {walletState.error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="border border-error/50 bg-error-container rounded-sm px-4 py-3 flex items-start gap-3"
                >
                  <span className="material-symbols-outlined text-error text-base leading-none mt-0.5">error</span>
                  <p className="text-sm text-on-error-container font-mono">{walletState.error}</p>
                </div>
              )}

              {walletState.stats && !walletState.isLoading && (
                <>
                  <WalletStats stats={walletState.stats} isLoading={false} />
                  <WalletActivityFeed
                    stats={walletState.stats}
                    walletAddress={walletState.address ?? ""}
                    isLoading={false}
                    isLoadingMore={walletState.isLoading}
                    onLoadMore={hasMore ? handleLoadMore : undefined}
                    hasMore={hasMore}
                  />
                </>
              )}

              {!walletState.stats && !walletState.isLoading && (
                <div className="border border-dashed border-outline-variant rounded-sm p-8 flex flex-col items-center gap-3 text-center">
                  <span className="material-symbols-outlined text-5xl text-outline/40 leading-none">qr_code</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-on-surface font-mono font-bold text-sm">
                      Enter a Base wallet address
                    </p>
                    <p className="text-on-surface-variant font-mono text-xs max-w-xs">
                      Track real-time transaction history, net flow, gas usage, and activity — all on-chain.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="lg:ml-64 w-full px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-950 py-8 border-t border-slate-200/40 dark:border-slate-800/40">
          <div className="font-bold text-slate-900 dark:text-slate-50 font-mono text-[10px] uppercase tracking-tighter">
            © 2024 BASE EVERYTHING. ECOSYSTEM INTELLIGENCE TERMINAL.
          </div>
          <div className="flex gap-6">
            {["Categories", "Socials", "Submit", "Documentation", "Privacy"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-[10px] uppercase tracking-tighter text-slate-400 hover:text-blue-500 hover:opacity-80 transition-opacity"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>

      </main>
    </div>
  );
}
