"use client";

/**
 * Wallet Dashboard Page — /dashboard
 * Figma: App Dashboard & Map — Frame 2041:13
 *
 * Layout: wallet input → stats row → activity feed
 * Integrates WT-BE-001 + WT-FE-001/002/003 + WT-BE-002
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { WalletInput } from "@/components/wallet/WalletInput";
import { WalletStats } from "@/components/wallet/WalletStats";
import { WalletActivityFeed } from "@/components/wallet/WalletActivityFeed";
import type { WalletStats as WalletStatsType } from "@/types/wallet";

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

// ─── API helper ────────────────────────────────────────────────────────────────

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

// ─── Page component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);

  // Stable ref to current page — avoids stale closure in handleLoadMore
  const pageRef = useRef(state.page);
  pageRef.current = state.page;

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
  }, [state.address, fetchWalletPage]);

  const hasMore = state.stats
    ? state.stats.transactions.length < state.stats.txCount
    : false;

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">
      {/* ── Top navbar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm">
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
