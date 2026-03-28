"use client";

/**
 * Wallet Dashboard Page — /dashboard
 * Figma: App Dashboard & Map — Frame 2041:13
 *
 * Layout: ecosystem overview/map → wallet input → stats row → activity feed
 * Integrates WT-BE-001 + WT-FE-001/002/003 + WT-BE-002
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { WalletInput } from "@/components/wallet/WalletInput";
import { WalletStats } from "@/components/wallet/WalletStats";
import { WalletActivityFeed } from "@/components/wallet/WalletActivityFeed";
import type { WalletStats as WalletStatsType } from "@/types/wallet";
import type { DashboardResponse, RegionSummary } from "@/types/dashboard";

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

// ─── Dashboard state ───────────────────────────────────────────────────────────

interface DashboardState {
  address: string | null;
  stats: WalletStatsType | null;
  isLoading: boolean;
  error: string | null;
  page: number;
}

const INITIAL_STATE: DashboardState = {
  address: null,
  stats: null,
  isLoading: false,
  error: null,
  page: 1,
};

// ─── API helpers ───────────────────────────────────────────────────────────────

async function fetchWalletPage(
  address: string,
  page: number
): Promise<WalletStatsType> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  const res = await fetch(`/api/wallet/${address}?${params}`, {
    // No ISR cache: client-side pagination must always be fresh.
    // Server/API layer handles its own caching via Cache-Control.
  });

  if (!res.ok) {
    if (res.status === 400) {
      throw new Error("Invalid wallet address");
    }
    if (res.status === 502) {
      throw new Error("Upstream API unavailable. Please try again.");
    }
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json() as Promise<WalletStatsType>;
}

async function fetchDashboard(): Promise<DashboardResponse> {
  const res = await fetch("/api/dashboard", {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Dashboard rate limited. Please refresh in a moment.");
    }
    throw new Error(`Dashboard load failed (${res.status})`);
  }

  return res.json() as Promise<DashboardResponse>;
}

// ─── Region badge colour ──────────────────────────────────────────────────────

function regionColor(color?: string): string {
  return color ?? "#6b7280";
}

// ─── Region card ──────────────────────────────────────────────────────────────

function RegionCard({ region }: { region: RegionSummary }) {
  const isActive = region.active;

  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-[var(--radius-md)] border transition-all"
      style={{
        borderColor: isActive ? regionColor(region.color) + "66" : "var(--border-outline-variant)",
        background: isActive ? regionColor(region.color) + "11" : "transparent",
        opacity: isActive ? 1 : 0.55,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none" role="img" aria-label={region.name}>
          {region.icon}
        </span>
        <span className="font-label font-semibold text-sm text-on-surface truncate">
          {region.name}
        </span>
        {isActive ? (
          <span className="ml-auto flex h-2 w-2 rounded-full" aria-label="Active">
            <span
              className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75"
              style={{ backgroundColor: regionColor(region.color) }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: regionColor(region.color) }}
            />
          </span>
        ) : (
          <span className="ml-auto text-[10px] font-label text-outline uppercase tracking-wider">
            Quiet
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-label text-outline">24h Volume</span>
          <span className="text-sm font-label font-semibold text-on-surface">
            {formatUSD(region.volume24h)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-label text-outline">Projects</span>
          <span className="text-sm font-label font-semibold text-on-surface">
            {region.projectCount}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-label text-outline">Wallets</span>
          <span className="text-sm font-label font-semibold text-on-surface">
            {formatWallets(region.activeWallets)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Trending badge ─────────────────────────────────────────────────────────────

function trendingTypeLabel(type: DashboardResponse["trendingNow"][number]["type"]): string {
  const labels: Record<string, string> = {
    surge: "🔥 Surge",
    new: "✨ New",
    viral: "🦠 Viral",
    airdrop: "🎁 Airdrop",
    listing: "📋 Listing",
    partnership: "🤝 Partnership",
  };
  return labels[type] ?? type;
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Stable ref to current page — avoids stale closure in handleLoadMore
  const pageRef = useRef(state.page);
  pageRef.current = state.page;

  // ── Fetch ecosystem dashboard overview ─────────────────────────────────────
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
          setDashboardError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setDashboardLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Fetch wallet data when address changes
  const loadWallet = useCallback(async (address: string, page = 1) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const stats = await fetchWalletPage(address, page);
      setState((s) => ({
        ...s,
        stats,
        address,
        page,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    setState((s) => {
      if (!s.address || s.isLoading) return s;
      return { ...s, isLoading: true };
    });

    // Capture page at click-time via ref (avoids stale closure)
    const nextPage = pageRef.current + 1;

    fetchWalletPage(state.address!, nextPage)
      .then((newStats) => {
        setState((s) => {
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
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Load more failed",
        }));
      });
  }, [state.address]);

  const hasMore = state.stats
    ? state.stats.transactions.length < state.stats.txCount
    : false;

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">
      {/* ── Top navbar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">
            account_balance_wallet
          </span>
          <span className="font-headline font-black text-base text-on-surface">
            Wallet Tracker
          </span>
          <span className="ml-auto text-xs font-label text-outline">
            Base
          </span>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── Section 0: Ecosystem Dashboard Overview ───────────────────── */}
        <section>
          <div className="rounded-[var(--radius-lg)] overflow-hidden">
            {/* Overview hero bar */}
            <div className="border border-outline-variant rounded-[var(--radius-lg)] bg-surface-container">
              <div className="flex items-center gap-2 p-4 border-b border-outline-variant/50">
                <span className="material-symbols-outlined text-primary text-lg leading-none">
                  dashboard
                </span>
                <h2 className="text-sm font-label font-semibold text-on-surface uppercase tracking-widest"
                    style={{ letterSpacing: "0.1em" }}>
                  Ecosystem Overview
                </h2>
                {dashboardLoading && (
                  <span className="ml-2 text-xs font-label text-outline animate-pulse">
                    Loading…
                  </span>
                )}
                {dashboard && (
                  <span className="ml-auto text-xs font-label text-outline">
                    {formatUSD(dashboard.overview.totalVolume24h)} 24h
                  </span>
                )}
              </div>

              {/* Stats strip */}
              {dashboardLoading && (
                <div className="grid grid-cols-3 divide-x divide-outline-variant/50">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col gap-1 p-4 items-center">
                      <div className="h-4 w-16 bg-outline-variant/30 rounded animate-pulse" />
                      <div className="h-3 w-12 bg-outline-variant/20 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              )}

              {dashboardError && (
                <div className="px-4 py-3 text-xs font-label text-error">
                  {dashboardError}
                </div>
              )}

              {dashboard && (
                <>
                  {/* KPI row */}
                  <div className="grid grid-cols-3 divide-x divide-outline-variant/50">
                    <div className="flex flex-col gap-1 p-4 items-center text-center">
                      <span className="text-lg font-headline font-black text-on-surface">
                        {dashboard.overview.totalProjects}
                      </span>
                      <span className="text-xs font-label text-outline uppercase tracking-wider">
                        Projects
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 items-center text-center">
                      <span className="text-lg font-headline font-black text-on-surface">
                        {formatUSD(dashboard.overview.totalVolume24h)}
                      </span>
                      <span className="text-xs font-label text-outline uppercase tracking-wider">
                        24h Volume
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 items-center text-center">
                      <span className="text-lg font-headline font-black text-on-surface">
                        {formatWallets(dashboard.overview.activeWallets)}
                      </span>
                      <span className="text-xs font-label text-outline uppercase tracking-wider">
                        Active Wallets
                      </span>
                    </div>
                  </div>

                  {/* Trending strip */}
                  {dashboard.trendingNow.length > 0 && (
                    <div className="border-t border-outline-variant/50 px-4 py-3 flex flex-col gap-2">
                      <span className="text-[10px] font-label text-outline uppercase tracking-widest">
                        🔥 Trending Now
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {dashboard.trendingNow.slice(0, 4).map((t) => (
                          <div
                            key={t.project}
                            className="flex items-center gap-1.5 rounded-full border border-outline-variant px-3 py-1"
                          >
                            <span className="text-[10px] font-label font-semibold text-on-surface">
                              {t.project}
                            </span>
                            <span
                              className="text-[10px] font-label font-semibold"
                              style={{ color: t.change >= 0 ? "var(--color-success)" : "var(--color-error)" }}
                            >
                              {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}%
                            </span>
                            <span className="text-[10px] font-label text-outline">
                              {trendingTypeLabel(t.type)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Region grid */}
            {dashboard && (
              <div className="mt-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dashboard.regions.map((region) => (
                    <RegionCard key={region.id} region={region} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Section 1: Wallet input ────────────────────────────────────── */}
        <section>
          <div className="border border-outline-variant rounded-[var(--radius-lg)] bg-surface-container p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-lg leading-none">
                search
              </span>
              <h2 className="text-sm font-label font-semibold text-on-surface uppercase tracking-widest"
                  style={{ letterSpacing: "0.1em" }}>
                Track Wallet
              </h2>
            </div>

            <WalletInput
              onSubmit={loadWallet}
              initialValue={state.address ?? ""}
              isLoading={state.isLoading && !!state.address}
            />
          </div>
        </section>

        {/* ── Error banner ───────────────────────────────────────────────── */}
        {state.error && (
          <section>
            <div
              role="alert"
              aria-live="assertive"
              className="border border-error/50 bg-error-container rounded-[var(--radius-sm)] px-4 py-3 flex items-start gap-3"
            >
              <span className="material-symbols-outlined text-error text-base leading-none mt-0.5">
                error
              </span>
              <p className="text-sm text-on-error-container font-label">{state.error}</p>
            </div>
          </section>
        )}

        {/* ── Section 2: Stats row ───────────────────────────────────────── */}
        {state.stats && (
          <section>
            <WalletStats stats={state.stats} isLoading={false} />
          </section>
        )}

        {/* ── Section 3: Activity feed ───────────────────────────────────── */}
        {state.stats && (
          <section>
            <WalletActivityFeed
              stats={state.stats}
              walletAddress={state.address ?? ""}
              isLoading={state.isLoading && state.page === 1}
              isLoadingMore={state.isLoading && state.page > 1}
              onLoadMore={hasMore ? handleLoadMore : undefined}
              hasMore={hasMore}
            />
          </section>
        )}

        {/* ── Empty state: no wallet selected ─────────────────────────────── */}
        {!state.stats && !state.isLoading && !state.error && (
          <section>
            <div className="border border-dashed border-outline-variant rounded-[var(--radius-lg)] p-12 flex flex-col items-center gap-4 text-center">
              <span className="material-symbols-outlined text-6xl text-outline/50 leading-none">
                qr_code
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-on-surface font-headline font-black text-lg">
                  Enter a Base wallet address
                </p>
                <p className="text-on-surface-variant font-label text-sm max-w-xs">
                  Track real-time transaction history, net flow, gas usage, and activity — all on-chain.
                </p>
              </div>
              <div className="flex flex-col gap-1 text-xs text-on-surface-variant/60 font-label">
                <span>Powered by Basescan</span>
                <span>Network: Base Mainnet</span>
              </div>
            </div>
          </section>
        )}

        {/* ── Footer note ────────────────────────────────────────────────── */}
        <footer className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-outline font-label">
          <span>Data sourced from Basescan · Base RPC</span>
          <span>Refreshes every 60s</span>
        </footer>
      </div>
    </main>
  );
}
