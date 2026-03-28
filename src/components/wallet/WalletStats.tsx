"use client";

/**
 * WalletStats — 4-card grid showing wallet overview metrics.
 * Cards: Total Txns, Net Flow (USD), Gas Spent (ETH), Last Active.
 *
 * Used in: /dashboard
 */

import { formatNumber, formatUSD, formatETH, truncateAddress } from "@/utils/wallet";
import type { WalletStats as WalletStatsType } from "@/types/wallet";

interface WalletStatsProps {
  stats: WalletStatsType;
  isLoading?: boolean;
}

function StatCard({
  label,
  value,
  subValue,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  highlight?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="border border-outline-variant rounded-[var(--radius-sm)] bg-surface-container p-4 flex flex-col gap-2">
      {/* Icon + label row */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-primary">
          {icon}
        </span>
        <span
          className="text-xs font-label font-medium text-on-surface-variant uppercase tracking-widest"
          style={{ letterSpacing: "0.1em" }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <p
        className={[
          "font-black text-2xl leading-none",
          highlight === "positive" ? "text-[#16a34a]" : "",
          highlight === "negative" ? "text-error" : "text-on-surface",
        ].join(" ")}
      >
        {value}
      </p>

      {/* Sub-value */}
      {subValue && (
        <p className="text-xs text-on-surface-variant font-label">{subValue}</p>
      )}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="border border-outline-variant rounded-[var(--radius-sm)] bg-surface-container p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-surface-container-high" />
        <div className="h-3 w-24 rounded bg-surface-container-high" />
      </div>
      <div className="h-8 w-28 rounded bg-surface-container-high" />
      <div className="h-3 w-16 rounded bg-surface-container-high" />
    </div>
  );
}

export function WalletStats({ stats, isLoading }: WalletStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const netFlowAbs = Math.abs(stats.netFlowUSD);
  const netFlowHighlight =
    stats.netFlowUSD > 0 ? "positive" : stats.netFlowUSD < 0 ? "negative" : "neutral";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Total Txns"
        value={formatNumber(stats.txCount)}
        subValue={`${stats.transactions.length} shown`}
        icon="receipt_long"
      />
      <StatCard
        label="Net Flow"
        value={stats.netFlowUSD >= 0 ? `+${formatUSD(netFlowAbs)}` : `-${formatUSD(netFlowAbs)}`}
        subValue="All time USD"
        icon={netFlowHighlight === "positive" ? "trending_up" : netFlowHighlight === "negative" ? "trending_down" : "trending_flat"}
        highlight={netFlowHighlight}
      />
      <StatCard
        label="Gas Spent"
        value={`${formatETH(stats.gasSpentETH)} ETH`}
        subValue="Historical total"
        icon="local_gas_station"
      />
      <StatCard
        label="Last Active"
        value={new Date(stats.lastActive).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        subValue={new Date(stats.lastActive).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        icon="schedule"
      />
    </div>
  );
}
