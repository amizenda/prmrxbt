"use client";

/**
 * EcosystemMap — matches Stitch HTML exactly
 * Node-based ecosystem visualization: DeFi node + BASE hub + Infra node
 * NO hexagon grid — this is the Stitch design.
 */

interface EcosystemMapProps {
  defiProjectCount?: number;
  infraProjectCount?: number;
  className?: string;
}

// ─── Stat display (inner stat of a cluster node) ──────────────────────────────

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-low p-2 rounded-sm border border-outline-variant/10">
      <div className="font-mono text-[8px] text-outline uppercase">{label}</div>
      <div className="font-mono text-xs font-bold">{value}</div>
    </div>
  );
}

// ─── DeFi cluster node ────────────────────────────────────────────────────────

function DeFiCluster({ projectCount }: { projectCount: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-surface-container border border-primary/20 p-4 rounded-sm group hover:bg-surface-bright hover:border-primary cursor-pointer transition-all">
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-primary mb-2">account_balance</span>
          <div className="font-mono text-[10px] font-bold uppercase tracking-tighter text-on-surface">
            DEFI SECTOR
          </div>
          <div className="text-[9px] text-outline font-mono">
            {projectCount > 0 ? projectCount : "34"} PROJECTS
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Infra cluster node ───────────────────────────────────────────────────────

function InfraCluster({ projectCount }: { projectCount: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-surface-container border border-outline-variant p-4 rounded-sm group hover:border-primary cursor-pointer transition-all">
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-outline group-hover:text-primary mb-2 transition-colors">layers</span>
          <div className="font-mono text-[10px] font-bold uppercase tracking-tighter text-on-surface">
            INFRASTRUCTURE
          </div>
          <div className="text-[9px] text-outline font-mono">
            {projectCount > 0 ? projectCount : "12"} PROJECTS
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SVG connection lines ─────────────────────────────────────────────────────

function ConnectionLines() {
  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full" aria-hidden="true">
      <path
        d="M 300 200 L 500 150"
        opacity="0.3"
        stroke="#003ec7"
        strokeDasharray="4"
        strokeWidth="1"
      />
      <path
        d="M 500 150 L 700 200"
        opacity="0.3"
        stroke="#003ec7"
        strokeDasharray="4"
        strokeWidth="1"
      />
      <path
        d="M 500 150 L 500 300"
        opacity="0.3"
        stroke="#003ec7"
        strokeDasharray="4"
        strokeWidth="1"
      />
    </svg>
  );
}

// ─── Zoom controls ────────────────────────────────────────────────────────────

function ZoomControls() {
  const buttons = [
    { icon: "zoom_in", label: "Zoom in" },
    { icon: "zoom_out", label: "Zoom out" },
    { icon: "fullscreen", label: "Fullscreen" },
  ];

  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.icon}
          aria-label={btn.label}
          className="p-2 bg-surface-container-low border border-outline-variant rounded-sm hover:bg-surface-container transition-all"
        >
          <span className="material-symbols-outlined text-sm text-on-surface">{btn.icon}</span>
        </button>
      ))}
    </div>
  );
}

// ─── EcosystemMap ─────────────────────────────────────────────────────────────

export function EcosystemMap({ defiProjectCount, infraProjectCount, className }: EcosystemMapProps) {
  return (
    <section
      className={[
        "relative bg-surface-container-lowest border border-outline-variant/40 rounded-sm overflow-hidden",
        "aspect-[21/9] min-h-[400px]",
        className ?? "",
      ].join(" ")}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* SVG connection lines */}
      <ConnectionLines />

      {/* Section title */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-primary flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Interactive Ecosystem Core
        </h2>
      </div>

      {/* Node cluster layout — centered */}
      <div className="relative w-full h-full flex items-center justify-center gap-20">
        {/* DeFi Cluster */}
        <DeFiCluster projectCount={defiProjectCount ?? 0} />

        {/* BASE Hub Node */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center bg-primary-fixed ring-8 ring-primary/5"
            role="img"
            aria-label="Base ecosystem hub"
          >
            <span className="font-black text-primary text-xl tracking-tighter font-headline">
              BASE
            </span>
          </div>
        </div>

        {/* Infrastructure Cluster */}
        <InfraCluster projectCount={infraProjectCount ?? 0} />
      </div>

      {/* Zoom controls */}
      <ZoomControls />
    </section>
  );
}
