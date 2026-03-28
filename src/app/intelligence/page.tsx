"use client";

/**
 * Intelligence Terminal — /intelligence
 * Figma: Intelligence Terminal — Frame 2041:1556
 * Design System: The Technical Curator
 * Primary: #0052FF · Background: #f9f9ff · Radius: 2px · No shadows
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Signal {
  id: string;
  type: "alert" | "insight" | "on-chain" | "social";
  title: string;
  description: string;
  source: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
  project?: string;
}

interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
}

interface Insight {
  id: string;
  category: string;
  title: string;
  body: string;
  confidence: number; // 0-100
  timestamp: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const METRICS: Metric[] = [
  { label: "Base TVL", value: "$4.28B", delta: "+$312M", positive: true, icon: "account_balance" },
  { label: "Daily Volume", value: "$1.84B", delta: "+22%", positive: true, icon: "trending_up" },
  { label: "Active Users", value: "482K", delta: "+8.4%", positive: true, icon: "group" },
  { label: "New Contracts", value: "1,847", delta: "+124", positive: true, icon: "description" },
  { label: "Bridge Volume", value: "$842M", delta: "+18%", positive: true, icon: "sync_alt" },
  { label: "Gas (avg gwei)", value: "18.4", delta: "-3.2%", positive: true, icon: "local_gas_station" },
];

const SIGNALS: Signal[] = [
  {
    id: "sig-001",
    type: "on-chain",
    title: "Uniswap V4 hooks deployment spike",
    description: "42 new hook contracts deployed to Base in the last 24h — 3x the weekly average.",
    source: "On-chain · 4m ago",
    timestamp: "4m ago",
    severity: "high",
    project: "Uniswap V4",
  },
  {
    id: "sig-002",
    type: "social",
    title: "Friend.tech KOL surge",
    description: "Top-10 keys experiencing renewed trading volume after 6-week low. Activity up 340% WoW.",
    source: "Social · 18m ago",
    timestamp: "18m ago",
    severity: "medium",
    project: "Friend.tech",
  },
  {
    id: "sig-003",
    type: "insight",
    title: "Stablecoin supply breaks $6B",
    description: "USDC + USDB total supply crossed $6B on Base for the first time. Institutional allocation pattern.",
    source: "Analytics · 1h ago",
    timestamp: "1h ago",
    severity: "low",
  },
  {
    id: "sig-004",
    type: "alert",
    title: "Novel deployer active on Base",
    description: "EOA 0x7f3a… deployed 8 similar contract patterns to Base in 20 minutes. Monitoring for rugs.",
    source: "Security · 2h ago",
    timestamp: "2h ago",
    severity: "critical",
  },
  {
    id: "sig-005",
    type: "on-chain",
    title: "Aerodrome: V3 gauge migration complete",
    description: "100% of liquidity migrated to V3 concentrated pools. Fees and APRs updating in real time.",
    source: "On-chain · 3h ago",
    timestamp: "3h ago",
    severity: "low",
    project: "Aerodrome",
  },
  {
    id: "sig-006",
    type: "social",
    title: "Base DevRel: hackathon winners announced",
    description: "ETHGlobal Bangkok Base track winners: 12 teams, $180K in prizes. All building production.",
    source: "Social · 5h ago",
    timestamp: "5h ago",
    severity: "medium",
  },
];

const INSIGHTS: Insight[] = [
  {
    id: "ins-001",
    category: "DeFi",
    title: "Concentrated liquidity on Base outperforms full-range by 4.2x",
    body: "Positions using 10–30% price range concentrated liquidity on Aerodrome V3 generate 4.2x more fees than full-range equivalents. Impermanent loss remains comparable to Ethereum L1 AMMs.",
    confidence: 94,
    timestamp: "2h ago",
  },
  {
    id: "ins-002",
    category: "Cross-chain",
    title: "Base bridging pattern: Ethereum → Base net inflow $312M/wk",
    body: "Rolling 7-day net bridge inflow to Base averages $312M. Outflows remain ~$89M, yielding a net directional flow that has persisted for 14 consecutive weeks.",
    confidence: 97,
    timestamp: "6h ago",
  },
  {
    id: "ins-003",
    category: "Social",
    title: "Key markets repricing after Friend.tech protocol fee change",
    body: "Post-fee-change, average key price for top-50 accounts has repriced -18%. However, unique trader count increased 22%, suggesting a healthier, less speculative market.",
    confidence: 88,
    timestamp: "1d ago",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function SeverityDot({ severity }: { severity: Signal["severity"] }) {
  const colors = {
    critical: "bg-red-500",
    high: "bg-amber-500",
    medium: "bg-[#0052FF]",
    low: "bg-emerald-500",
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${colors[severity]}`}
          title={severity} />
  );
}

function SignalTypeIcon({ type }: { type: Signal["type"] }) {
  const map: Record<Signal["type"], string> = {
    "on-chain": "fingerprint",
    social: "forum",
    insight: "lightbulb",
    alert: "warning",
  };
  return (
    <span className={`material-symbols-outlined text-base leading-none flex-shrink-0`}
          style={{ color: "var(--color-primary)" }}>
      {map[type]}
    </span>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const color = confidence >= 90 ? "bg-emerald-500" : confidence >= 75 ? "bg-[#0052FF]" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-[10px] font-label text-outline flex-shrink-0" style={{ letterSpacing: "0.05em" }}>
        {confidence}%
      </span>
    </div>
  );
}

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = "overview" | "signals" | "insights";

// ─── Page component ───────────────────────────────────────────────────────────

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [signalFilter, setSignalFilter] = useState<Signal["type"] | "all">("all");

  const filteredSignals = signalFilter === "all"
    ? SIGNALS
    : SIGNALS.filter((s) => s.type === signalFilter);

  const signalTypeColors: Record<string, string> = {
    "on-chain": "text-primary",
    social: "text-purple-600",
    insight: "text-amber-600",
    alert: "text-red-500",
  };

  return (
    <main className="min-h-screen bg-surface pb-20 lg:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl leading-none">
            terminal
          </span>
          <span className="font-headline font-black text-base text-on-surface">
            Intelligence
          </span>
          <span className="ml-auto font-label text-xs text-outline uppercase" style={{ letterSpacing: "0.08em" }}>
            Live
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline font-black text-2xl text-on-surface">
            Intelligence Terminal
          </h1>
          <p className="font-label text-xs text-on-surface-variant uppercase" style={{ letterSpacing: "0.08em" }}>
            On-chain signals · AI insights · Real-time analytics
          </p>
        </div>

        {/* ── Tab navigation ───────────────────────────────────────────── */}
        <div className="flex border-b border-outline-variant">
          {(["overview", "signals", "insights"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-label font-semibold uppercase border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
              style={{ letterSpacing: "0.08em" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview tab ────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">

            {/* Metrics grid */}
            <section>
              <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
                Network Metrics · Live
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {METRICS.map((m) => (
                  <div key={m.label}
                       className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-primary/70 text-base leading-none">
                        {m.icon}
                      </span>
                      <span className={`text-[10px] font-label font-semibold ${m.positive ? "text-emerald-600" : "text-red-500"}`}>
                        {m.delta}
                      </span>
                    </div>
                    <span className="text-lg font-headline font-black text-on-surface leading-none">
                      {m.value}
                    </span>
                    <span className="font-label text-[10px] text-outline uppercase" style={{ letterSpacing: "0.07em" }}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Latest signals summary */}
            <section>
              <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
                Latest Signals
              </h2>
              <div className="flex flex-col gap-2">
                {SIGNALS.slice(0, 4).map((sig) => (
                  <div key={sig.id}
                       className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-3 flex items-start gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      <SeverityDot severity={sig.severity} />
                      <SignalTypeIcon type={sig.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-label font-semibold text-on-surface">
                          {sig.title}
                        </span>
                        {sig.project && (
                          <span className="text-[10px] font-label text-primary uppercase" style={{ letterSpacing: "0.06em" }}>
                            {sig.project}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-body text-on-surface-variant leading-relaxed">
                        {sig.description}
                      </span>
                    </div>
                    <span className="text-[10px] font-label text-outline flex-shrink-0" style={{ letterSpacing: "0.05em" }}>
                      {sig.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Top insights */}
            <section>
              <h2 className="font-label text-[10px] text-outline uppercase mb-3" style={{ letterSpacing: "0.1em" }}>
                AI Insights
              </h2>
              <div className="flex flex-col gap-2">
                {INSIGHTS.map((ins) => (
                  <div key={ins.id}
                       className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-label text-primary uppercase" style={{ letterSpacing: "0.07em" }}>
                          {ins.category}
                        </span>
                        <h3 className="text-sm font-headline font-black text-on-surface leading-snug">
                          {ins.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-label text-outline flex-shrink-0 mt-0.5" style={{ letterSpacing: "0.05em" }}>
                        {ins.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                      {ins.body}
                    </p>
                    <ConfidenceBar confidence={ins.confidence} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── Signals tab ──────────────────────────────────────────────── */}
        {activeTab === "signals" && (
          <div className="flex flex-col gap-4">
            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
              {(["all", "on-chain", "social", "insight", "alert"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setSignalFilter(f)}
                  className={`px-3 py-1.5 text-xs font-label font-semibold rounded-[2px] border transition-colors ${
                    signalFilter === f
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40"
                  }`}
                  style={{ letterSpacing: "0.06em" }}
                >
                  {f === "all" ? "All Signals" : f.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>

            {/* Signal list */}
            <div className="flex flex-col gap-2">
              {filteredSignals.map((sig) => (
                <div key={sig.id}
                     className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-4 flex items-start gap-3 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <SeverityDot severity={sig.severity} />
                    <SignalTypeIcon type={sig.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-label font-bold uppercase ${signalTypeColors[sig.type]}`}
                            style={{ letterSpacing: "0.07em" }}>
                        {sig.type.replace("-", " ")}
                      </span>
                      {sig.project && (
                        <span className="text-[10px] font-label text-primary bg-primary/10 px-1.5 py-0.5 rounded-[2px]">
                          {sig.project}
                        </span>
                      )}
                      <span className="text-[10px] font-label text-outline ml-auto">
                        {sig.source}
                      </span>
                    </div>
                    <h3 className="text-sm font-headline font-black text-on-surface mb-1">
                      {sig.title}
                    </h3>
                    <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                      {sig.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Insights tab ─────────────────────────────────────────────── */}
        {activeTab === "insights" && (
          <div className="flex flex-col gap-3">
            {INSIGHTS.map((ins) => (
              <div key={ins.id}
                   className="border border-outline-variant rounded-[2px] bg-surface-container-lowest p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-label text-primary uppercase" style={{ letterSpacing: "0.1em" }}>
                      {ins.category}
                    </span>
                    <h3 className="font-headline font-black text-base text-on-surface leading-snug max-w-xl">
                      {ins.title}
                    </h3>
                  </div>
                  <span className="text-xs font-label text-outline flex-shrink-0" style={{ letterSpacing: "0.05em" }}>
                    {ins.timestamp}
                  </span>
                </div>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed max-w-3xl">
                  {ins.body}
                </p>
                <ConfidenceBar confidence={ins.confidence} />
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="pt-4 flex items-center justify-between text-xs text-outline font-label">
          <span>Signals powered by on-chain indexing + AI</span>
          <span>Updated every 60s</span>
        </footer>
      </div>
    </main>
  );
}
