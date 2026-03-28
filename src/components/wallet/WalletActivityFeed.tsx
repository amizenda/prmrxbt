"use client";

/**
 * WalletActivityFeed — scrollable transaction list.
 * Each item: type badge, amount, token, timestamp, truncated tx hash.
 *
 * Used in: /dashboard
 */

import { useState, useCallback } from "react";
import type { WalletTransaction, WalletStats } from "@/types/wallet";
import { truncateHash, truncateAddress } from "@/utils/wallet";

// ─── Types ───────────────────────────────────────────────────────────────────

interface WalletActivityFeedProps {
  stats: WalletStats;
  walletAddress: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TX_TYPE_META: Record<
  WalletTransaction["type"],
  { label: string; color: string; icon: string }
> = {
  native: {
    label: "ETH",
    color: "bg-primary/15 text-primary",
    icon: "payments",
  },
  transfer: {
    label: "Transfer",
    color: "bg-secondary/15 text-secondary",
    icon: "swap_horiz",
  },
  swap: {
    label: "Swap",
    color: "bg-tertiary/15 text-tertiary",
    icon: "sync_alt",
  },
};

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;

  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Transaction Item ────────────────────────────────────────────────────────

function TxItem({
  tx,
  walletAddress,
}: {
  tx: WalletTransaction;
  walletAddress: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = TX_TYPE_META[tx.type];
  const isIncoming = tx.to?.toLowerCase() === walletAddress.toLowerCase();
  const isSelf = tx.from?.toLowerCase() === tx.to?.toLowerCase();

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
      className={[
        "w-full text-left border border-outline-variant rounded-[var(--radius-sm)]",
        "bg-surface-container-low p-3 cursor-pointer",
        "hover:bg-surface-container transition-colors duration-100",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* Type icon */}
        <div
          className={[
            "w-8 h-8 rounded-[var(--radius-sm)] flex-shrink-0",
            "flex items-center justify-center",
            meta.color,
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-sm leading-none">
            {meta.icon}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: type badge + direction + amount */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={[
                "text-xs font-label font-semibold px-1.5 py-0.5 rounded-[2px]",
                meta.color,
              ].join(" ")}
            >
              {meta.label}
            </span>

            {!isSelf && (
              <span
                className={[
                  "text-xs font-label",
                  isIncoming ? "text-[#16a34a]" : "text-error",
                ].join(" ")}
              >
                {isIncoming ? "+" : "-"}
              </span>
            )}

            <span className="text-sm font-black text-on-surface">
              {tx.amount} <span className="font-label text-xs text-on-surface-variant">{tx.token}</span>
            </span>
          </div>

          {/* Row 2: from/to + timestamp */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {tx.from && (
              <span className="text-xs font-mono text-on-surface-variant">
                {truncateAddress(tx.from, 4)}{" "}
                <span className="opacity-50">→</span>{" "}
                {truncateAddress(tx.to ?? "", 4)}
              </span>
            )}
            <span className="text-xs text-on-surface-variant/60 ml-auto">
              {formatRelativeTime(tx.timestamp)}
            </span>
          </div>

          {/* Expanded: full addresses + tx hash */}
          {expanded && (
            <div className="mt-2 pt-2 border-t border-outline-variant/40 flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                <span className="font-label font-medium text-[10px] uppercase text-outline">
                  From
                </span>
                <span>{tx.from}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                <span className="font-label font-medium text-[10px] uppercase text-outline">
                  To
                </span>
                <span>{tx.to ?? "(contract)"}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                <span className="font-label font-medium text-[10px] uppercase text-outline">
                  Hash
                </span>
                <a
                  href={`https://basescan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary hover:underline"
                >
                  {truncateHash(tx.hash, 8)}
                </a>
              </div>
              <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                <span className="font-label font-medium text-[10px] uppercase text-outline">
                  Time
                </span>
                <span>{new Date(tx.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Skeleton Item ────────────────────────────────────────────────────────────

function TxItemSkeleton() {
  return (
    <div className="border border-outline-variant rounded-[var(--radius-sm)] bg-surface-container-low p-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-surface-container-high flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-surface-container-high" />
          <div className="h-3 w-48 rounded bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ address }: { address: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="material-symbols-outlined text-5xl text-outline">
        inbox
      </span>
      <p className="text-on-surface-variant font-label text-sm">
        No transactions found for
      </p>
      <p className="font-mono text-xs text-primary break-all px-4">{address}</p>
      <p className="text-on-surface-variant/60 text-xs">
        This wallet may be new or inactive on Base.
      </p>
    </div>
  );
}

// ─── Main Feed ────────────────────────────────────────────────────────────────

export function WalletActivityFeed({
  stats,
  walletAddress,
  isLoading,
  isLoadingMore = false,
  onLoadMore,
  hasMore,
}: WalletActivityFeedProps) {
  const txs = stats.transactions;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-widest"
            style={{ letterSpacing: "0.1em" }}>
          Activity Feed
        </h2>
        <span className="text-xs text-on-surface-variant font-label">
          {stats.txCount} total
        </span>
      </div>

      {/* Transaction list */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <TxItemSkeleton key={i} />
          ))}
        </div>
      ) : txs.length === 0 ? (
        <EmptyState address={walletAddress} />
      ) : (
        <div className="flex flex-col gap-2">
          {txs.map((tx) => (
            <TxItem key={tx.hash} tx={tx} walletAddress={walletAddress} />
          ))}

          {/* Load more */}
          {hasMore && onLoadMore && (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoading || isLoadingMore}
              className={[
                "mt-1 py-2 rounded-[var(--radius-sm)]",
                "border border-dashed border-outline-variant",
                "text-sm font-label text-on-surface-variant",
                "hover:border-primary hover:text-primary",
                "transition-colors duration-150",
                "disabled:opacity-40",
                "flex items-center justify-center gap-2",
              ].join(" ")}
            >
              {isLoadingMore ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin" aria-hidden="true">
                    progress_activity
                  </span>
                  Loading more…
                </>
              ) : (
                "Load more transactions"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
