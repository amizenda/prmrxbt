"use client";

/**
 * ProjectDrawer — matches Stitch HTML detail drawer exactly
 * Base Everything Intelligence Terminal
 */

import type { ProjectCardData } from "./ProjectCard";

export interface ProjectDetail {
  id: string;
  name: string;
  ticker: string;
  thesis: string;
  metrics: [string, string, boolean?][]; // [label, value, isPrimary?]
  narratives: string[];
  governance: {
    label: string;
    sublabel: string;
  };
  dappUrl?: string;
}

interface ProjectDrawerProps {
  project?: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_DETAIL: ProjectDetail = {
  id: "aerodrome",
  name: "Aerodrome",
  ticker: "AERO // LIQUIDITY HUB",
  thesis:
    "Aerodrome isn't just a fork; it's the economic engine of Base. By aligning incentives between LPs, voters, and traders, it creates a self-sustaining liquidity flywheel that other chains struggle to replicate.",
  metrics: [
    ["Fully Diluted Val", "$824,192,042", false],
    ["24H Fees", "$312,402", true],
    ["Emissions / Epoch", "12.4M AERO", false],
    ["Avg Slippage", "0.04%", false],
  ],
  narratives: ["Real Yield", "ve(3,3) Model", "Base Summer", "Core Pillar"],
  governance: {
    label: "Community Led DAO",
    sublabel: "14,204 Active Voters",
  },
  dappUrl: "https://aerodrome.finance",
};

function NarrativeBadge({ label, primary }: { label: string; primary?: boolean }) {
  return primary ? (
    <span className="px-3 py-1 bg-primary text-on-primary rounded-full font-mono text-[10px] uppercase font-bold">
      {label}
    </span>
  ) : (
    <span className="px-3 py-1 bg-surface-container border border-outline-variant/40 rounded-full font-mono text-[10px] uppercase font-bold text-on-surface-variant">
      {label}
    </span>
  );
}

function MetricCell({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest p-4">
      <div className="font-mono text-[9px] text-outline uppercase">{label}</div>
      <div
        className={[
          "font-mono text-lg font-bold tracking-tight",
          primary ? "text-primary" : "text-on-surface",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

export function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
  const detail = project ?? DEMO_DETAIL;

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-0 w-full md:w-96 lg:w-[450px] h-[calc(100vh-3.5rem)] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Drawer header */}
      <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-12 h-12 bg-white rounded-sm border border-outline-variant flex items-center justify-center p-1">
            <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-sm">
              <span className="text-sm font-black text-primary font-headline">
                {detail.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-on-surface">{detail.name}</h2>
            <div className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
              {detail.ticker}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="material-symbols-outlined text-outline hover:text-on-surface transition-all"
        >
          close
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* Editorial Thesis */}
        <section className="space-y-4">
          <h3 className="font-mono text-[10px] font-bold text-outline tracking-[0.2em] uppercase">
            Premier Base Editorial Thesis
          </h3>
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-sm">
            <p className="text-sm italic leading-relaxed text-on-surface-variant font-medium">
              &ldquo;{detail.thesis}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-on-background" />
              <span className="font-mono text-[9px] font-bold uppercase">Base Core Research Team</span>
            </div>
          </div>
        </section>

        {/* Terminal Metrics */}
        <section className="space-y-4">
          <h3 className="font-mono text-[10px] font-bold text-outline tracking-[0.2em] uppercase">
            Terminal Metrics
          </h3>
          <div className="grid grid-cols-2 gap-px bg-outline-variant/30 border border-outline-variant/30">
            {detail.metrics.map(([label, value, primary]) => (
              <MetricCell
                key={label}
                label={label}
                value={value}
                primary={primary}
              />
            ))}
          </div>
        </section>

        {/* Ecosystem Narratives */}
        <section className="space-y-4">
          <h3 className="font-mono text-[10px] font-bold text-outline tracking-[0.2em] uppercase">
            Ecosystem Narratives
          </h3>
          <div className="flex flex-wrap gap-2">
            {detail.narratives.map((n, i) => (
              <NarrativeBadge
                key={n}
                label={n}
                primary={i === detail.narratives.length - 1}
              />
            ))}
          </div>
        </section>

        {/* Identity & Governance */}
        <section className="space-y-4">
          <h3 className="font-mono text-[10px] font-bold text-outline tracking-[0.2em] uppercase">
            Identity &amp; Governance
          </h3>
          <div className="flex items-center gap-4 p-4 border border-outline-variant/40 bg-surface-container-low rounded-sm">
            {/* Avatar stack — placeholder avatars */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant" />
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high" />
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-outline" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-on-surface">{detail.governance.label}</div>
              <div className="font-mono text-[9px] text-outline uppercase">
                {detail.governance.sublabel}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer actions */}
      <div className="p-6 bg-surface-container-highest border-t border-outline-variant flex gap-3">
        <a
          href={detail.dappUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-primary text-on-primary py-3 rounded-sm font-bold font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-all text-center"
        >
          OPEN DAPP
        </a>
        <button
          className="px-4 border border-outline text-outline rounded-sm hover:bg-surface-container transition-all flex items-center justify-center"
          aria-label="Share"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>
    </div>
  );
}
