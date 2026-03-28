"use client";

/**
 * MapWidget — Ecosystem Zone Map
 * Base Everything — Intelligence Terminal
 *
 * Shows a CSS/SVG-based hexagon map of Base ecosystem zones.
 * Each zone is a clickable card representing a category of dapps.
 * Data is mock/MVP — real data can be wired in via props later.
 */

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EcosystemZone {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  color: string;      // border + label accent
  glowColor: string;  // bg fill when active
  stat?: string;
  statLabel?: string;
  topProtocol?: string;
}

export interface MapWidgetProps {
  zones?: EcosystemZone[];
  activeZone?: string | null;
  onZoneSelect?: (zoneId: string | null) => void;
}

// ─── Mock ecosystem data ────────────────────────────────────────────────────

const DEFAULT_ZONES: EcosystemZone[] = [
  {
    id: "defi",
    label: "DeFi",
    sublabel: "Lending · Swaps · Yield",
    icon: "trending_up",
    color: "#0052FF",
    glowColor: "#e9edff",
    stat: "$824M",
    statLabel: "TVL",
    topProtocol: "Aerodrome",
  },
  {
    id: "nft",
    label: "NFT",
    sublabel: "Marketplaces · Mint · Art",
    icon: "grid_view",
    color: "#7c3aed",
    glowColor: "#f3effe",
    stat: "42K",
    statLabel: "24H Vol",
    topProtocol: "Zora",
  },
  {
    id: "social",
    label: "Social",
    sublabel: "Social Graph · Identity",
    icon: "group",
    color: "#db2777",
    glowColor: "#fdf2f8",
    stat: "1.2M",
    statLabel: "Users",
    topProtocol: "Farcaster",
  },
  {
    id: "infra",
    label: "Infra",
    sublabel: "Storage · Compute · Index",
    icon: "dns",
    color: "#0891b2",
    glowColor: "#ecfeff",
    stat: "99.9%",
    statLabel: "Uptime",
    topProtocol: "Base RPC",
  },
  {
    id: "gaming",
    label: "Gaming",
    sublabel: "GameFi · P2E · Metaverse",
    icon: "sports_esports",
    color: "#ea580c",
    glowColor: "#fff7ed",
    stat: "8.4K",
    statLabel: "DAU",
    topProtocol: "Matchroom",
  },
  {
    id: "bridge",
    label: "Bridge",
    sublabel: "Cross-chain · Liquidity",
    icon: "swap_horiz",
    color: "#16a34a",
    glowColor: "#f0fdf4",
    stat: "$312K",
    statLabel: "24H Fees",
    topProtocol: "Across",
  },
];

// ─── SVG Hexagon path ────────────────────────────────────────────────────────

function hexagonPath(cx: number, cy: number, r: number): string {
  const points: [number, number][] = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ") + " Z";
}

// ─── Zone tooltip / expanded card ──────────────────────────────────────────

function ZoneCard({
  zone,
  isActive,
  onToggle,
}: {
  zone: EcosystemZone;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={[
        "w-full text-left border rounded-[var(--radius-sm)] p-4 transition-all duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        isActive
          ? "border-[var(--color-primary)] bg-[var(--color-surface-container)]"
          : "border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:border-[var(--color-primary)]/40",
      ].join(" ")}
      style={{
        borderColor: isActive ? zone.color : undefined,
        backgroundColor: isActive ? zone.glowColor : undefined,
        outlineColor: zone.color,
      }}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="material-symbols-outlined text-lg leading-none"
          style={{ color: isActive ? zone.color : "var(--color-on-surface-variant)" }}
        >
          {zone.icon}
        </span>
        <span
          className="text-sm font-label font-semibold uppercase tracking-widest"
          style={{
            letterSpacing: "0.1em",
            color: isActive ? zone.color : "var(--color-on-surface)",
          }}
        >
          {zone.label}
        </span>
      </div>

      {/* Sublabel */}
      <p className="text-xs text-on-surface-variant font-label mb-3">
        {zone.sublabel}
      </p>

      {/* Stat + protocol */}
      {zone.stat && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-black text-on-surface leading-none">{zone.stat}</p>
            <p className="text-[10px] font-label text-outline uppercase tracking-wider mt-0.5">
              {zone.statLabel}
            </p>
          </div>
          {zone.topProtocol && (
            <div className="text-right">
              <p className="text-[10px] font-label text-outline uppercase tracking-wider">
                Top
              </p>
              <p className="text-xs font-label font-semibold text-on-surface-variant">
                {zone.topProtocol}
              </p>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

// ─── MapWidget ───────────────────────────────────────────────────────────────

export function MapWidget({
  zones = DEFAULT_ZONES,
  activeZone,
  onZoneSelect,
}: MapWidgetProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === activeZone);

  function handleZoneToggle(zoneId: string) {
    if (activeZone === zoneId) {
      onZoneSelect?.(null);
    } else {
      onZoneSelect?.(zoneId);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg leading-none">
          public
        </span>
        <h2
          className="text-sm font-label font-semibold text-on-surface uppercase tracking-widest"
          style={{ letterSpacing: "0.1em" }}
        >
          Ecosystem Map
        </h2>
        <span className="ml-auto text-[10px] font-label text-outline uppercase tracking-widest">
          Base · Live
        </span>
      </div>

      {/* ── Map grid (SVG hexes + zone cards) ───────────────────────────── */}
      <div className="border border-outline-variant rounded-[var(--radius-lg)] bg-surface-container-low overflow-hidden">
        {/* Hex map visual — CSS/SVG grid */}
        <div className="relative w-full overflow-hidden" style={{ height: "180px" }}>
          {/* Grid dots background */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-on-surface) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* SVG hexes */}
          <svg
            viewBox="0 0 720 180"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {/* Connecting lines */}
            <line x1="120" y1="90" x2="240" y2="90" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="240" y1="90" x2="360" y2="90" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="360" y1="90" x2="480" y2="90" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="480" y1="90" x2="600" y2="90" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="240" y1="90" x2="300" y2="40" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="360" y1="90" x2="420" y2="40" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="240" y1="90" x2="300" y2="140" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="360" y1="90" x2="420" y2="140" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Zone hexes */}
            {[
              { cx: 120, cy: 90, zone: zones[0], idx: 0 },
              { cx: 240, cy: 90, zone: zones[1], idx: 1 },
              { cx: 360, cy: 90, zone: zones[2], idx: 2 },
              { cx: 480, cy: 90, zone: zones[3], idx: 3 },
              { cx: 600, cy: 90, zone: zones[4], idx: 4 },
              { cx: 300, cy: 40, zone: zones[5], idx: 5 },
              { cx: 420, cy: 40, zone: zones[0], idx: 6 },
              { cx: 300, cy: 140, zone: zones[1], idx: 7 },
              { cx: 420, cy: 140, zone: zones[2], idx: 8 },
            ].map(({ cx, cy, zone, idx }) => {
              const isHovered = hoveredZone === zone.id;
              const isSelected = activeZone === zone.id;
              const fill = isSelected || isHovered ? zone.glowColor : "var(--color-surface-container-lowest)";
              const stroke = isSelected ? zone.color : isHovered ? zone.color + "99" : "var(--color-outline-variant)";
              const strokeWidth = isSelected ? 2 : 1;
              const r = isSelected ? 34 : isHovered ? 33 : 32;

              return (
                <g key={idx}>
                  <path
                    d={hexagonPath(cx, cy, r)}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{ transition: "all 150ms ease" }}
                  />
                  <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? zone.color : "var(--color-on-surface)"}
                    fontSize="9"
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight={isSelected ? "700" : "500"}
                    letterSpacing="0.05em"
                    style={{ textTransform: "uppercase", transition: "fill 150ms ease" }}
                  >
                    {zone.label.slice(0, 4).toUpperCase()}
                  </text>
                  {zone.stat && (
                    <text
                      x={cx}
                      y={cy + 9}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected ? zone.color : "var(--color-outline)"}
                      fontSize="7"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="400"
                    >
                      {zone.stat}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Base logo mark (center) */}
            <circle cx="360" cy="90" r="18" fill="var(--color-primary)" opacity="0.12" />
            <circle cx="360" cy="90" r="10" fill="var(--color-primary)" opacity="0.2" />
            <circle cx="360" cy="90" r="5" fill="var(--color-primary)" />
          </svg>

          {/* Interaction overlay — invisible hit targets */}
          <div className="absolute inset-0">
            {[
              { x: "16.7%", y: "50%", zone: zones[0] },
              { x: "33.3%", y: "50%", zone: zones[1] },
              { x: "50%", y: "50%", zone: zones[2] },
              { x: "66.7%", y: "50%", zone: zones[3] },
              { x: "83.3%", y: "50%", zone: zones[4] },
              { x: "41.7%", y: "22%", zone: zones[5] },
              { x: "58.3%", y: "22%", zone: zones[0] },
              { x: "41.7%", y: "78%", zone: zones[1] },
              { x: "58.3%", y: "78%", zone: zones[2] },
            ].map(({ x, y, zone }, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => handleZoneToggle(zone.id)}
                className="absolute border border-transparent rounded-full"
                style={{
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                  width: "64px",
                  height: "64px",
                  background: "transparent",
                }}
                aria-label={`Select ${zone.label} zone`}
              />
            ))}
          </div>
        </div>

        {/* ── Zone detail card (when a zone is active) ──────────────────── */}
        {selectedZone && (
          <div
            className="border-t px-4 py-3 flex items-center gap-4"
            style={{
              borderColor: selectedZone.color + "40",
              backgroundColor: selectedZone.glowColor,
            }}
          >
            <span
              className="material-symbols-outlined text-2xl leading-none"
              style={{ color: selectedZone.color }}
            >
              {selectedZone.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-label font-bold uppercase tracking-widest"
                  style={{ color: selectedZone.color, letterSpacing: "0.1em" }}
                >
                  {selectedZone.label}
                </span>
                <span className="text-xs font-label text-outline">—</span>
                <span className="text-xs font-label text-on-surface-variant">
                  {selectedZone.sublabel}
                </span>
              </div>
              {selectedZone.topProtocol && (
                <p className="text-xs font-label text-outline mt-0.5">
                  Leading protocol:{" "}
                  <span className="text-on-surface-variant font-semibold">
                    {selectedZone.topProtocol}
                  </span>
                </p>
              )}
            </div>
            {selectedZone.stat && (
              <div className="text-right shrink-0">
                <p
                  className="text-xl font-black leading-none"
                  style={{ color: selectedZone.color }}
                >
                  {selectedZone.stat}
                </p>
                <p className="text-[10px] font-label text-outline uppercase tracking-wider mt-0.5">
                  {selectedZone.statLabel}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Zone legend chips ─────────────────────────────────────────── */}
        <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-outline-variant/40">
          {zones.slice(0, 6).map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneToggle(zone.id)}
              className={[
                "flex items-center gap-1.5 px-2 py-1 rounded-[9999px] border text-[10px] font-label font-semibold uppercase tracking-widest transition-all duration-150",
                activeZone === zone.id
                  ? "border-current"
                  : "border-[var(--color-outline-variant)] text-on-surface-variant hover:border-[var(--color-outline)]",
              ].join(" ")}
              style={{
                color: activeZone === zone.id ? zone.color : undefined,
                borderColor: activeZone === zone.id ? zone.color + "80" : undefined,
                letterSpacing: "0.05em",
              }}
            >
              <span
                className="material-symbols-outlined text-base leading-none"
                style={{ color: activeZone === zone.id ? zone.color : "var(--color-outline)" }}
              >
                {zone.icon}
              </span>
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Zone cards grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {zones.slice(0, 6).map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            isActive={activeZone === zone.id}
            onToggle={() => handleZoneToggle(zone.id)}
          />
        ))}
      </div>
    </div>
  );
}
