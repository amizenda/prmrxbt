"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────
// Trending Projects — synced from Stitch editorial
// Design: 4-column grid, sharp rounded-sm corners
// ─────────────────────────────────────────────────────────

const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const CARDS = [
  {
    name:        "Aerodrome",
    ticker:      "$AERO",
    description: "The central liquidity hub on Base, featuring a next-generation AMM engine.",
    isHighlight: true,
    badge:       null,
    stats:       [{ label: "Mindshare", value: "98.4" }, { label: "TVL", value: "$742M" }],
  },
  {
    name:        "friend.tech",
    ticker:      "$FRIEND",
    description: "The marketplace for your friends. Monetizing social influence on-chain.",
    isHighlight: false,
    badge:       { label: "Social", bg: "bg-secondary-container", text: "text-secondary" },
    stats:       [{ label: "Mindshare", value: "92.1" }, { label: "Volume", value: "$12.4M" }],
  },
  {
    name:        "Virtuals",
    ticker:      "$VIRTUAL",
    description: "Autonomous AI agents living on Base, interacting across protocols.",
    isHighlight: false,
    badge:       { label: "AI Agent", bg: "bg-tertiary-container/20", text: "text-tertiary-container" },
    stats:       [{ label: "Mindshare", value: "89.7" }, { label: "Growth", value: "+245%" }],
  },
  {
    name:        "Basenames",
    ticker:      "L2 ENS",
    description: "Native identity layer for the Base ecosystem. Claim your .base.",
    isHighlight: false,
    badge:       { label: "Identity", bg: "bg-secondary-container", text: "text-secondary" },
    stats:       [{ label: "Mindshare", value: "85.2" }, { label: "Registered", value: "420K+" }],
  },
];

export function TrendingSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <span className="font-[family-name:var(--font-label)] text-[11px] font-bold
            tracking-[0.2em] text-primary uppercase block mb-2">
            Live_Activity
          </span>
          <h2 className="text-4xl font-black tracking-tighter text-on-surface uppercase
            font-[family-name:var(--font-headline)]">
            Trending Projects
          </h2>
        </div>

        {/* Arrow nav */}
        <div className="flex gap-2">
          {[{ icon: "chevron_left", label: "left" }, { icon: "chevron_right", label: "right" }].map(({ icon, label }) => (
            <button
              key={label}
              aria-label={label}
              className="w-10 h-10 border border-outline-variant flex items-center justify-center
                hover:bg-surface-container transition-all rounded-sm"
            >
              <span className="material-symbols-outlined text-base">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4-column card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((card, i) => (
          <motion.div key={card.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
            <article
              className={`
                flex flex-col justify-between min-h-[320px] p-6 cursor-pointer group
                ${card.isHighlight
                  ? "bg-primary border border-primary text-on-primary hover:bg-primary-container"
                  : "bg-surface-container-lowest border border-outline-variant/40 text-on-surface hover:border-primary"
                }
                rounded-sm transition-all
              `}
            >
              {/* Header: logo + badge */}
              <div className="flex justify-between items-start">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-sm p-2
                    ${card.isHighlight ? "bg-white/20" : "bg-surface-container-high"}`}
                >
                  {/* Placeholder monogram — replace with actual logo */}
                  <span className="font-black leading-none font-[family-name:var(--font-headline)]"
                    style={{ fontSize: 14, color: card.isHighlight ? "white" : "#141b2b" }}>
                    {card.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                {card.isHighlight ? (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full
                    font-[family-name:var(--font-label)] text-[9px] tracking-widest uppercase">
                    Rank_01
                  </span>
                ) : card.badge ? (
                  <span className={`px-2 py-0.5 rounded-full font-[family-name:var(--font-label)]
                    text-[9px] tracking-widest uppercase ${card.badge.bg} ${card.badge.text}`}>
                    {card.badge.label}
                  </span>
                ) : null}
              </div>

              {/* Title + ticker */}
              <div className="mb-4">
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-1
                  font-[family-name:var(--font-headline)]">
                  {card.name}
                </h3>
                <span className={`font-[family-name:var(--font-label)] text-xs tracking-widest
                  ${card.isHighlight ? "opacity-80" : "text-outline"}`}>
                  {card.ticker}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-6 line-clamp-2 leading-snug
                ${card.isHighlight ? "opacity-90" : "text-on-surface-variant"}`}>
                {card.description}
              </p>

              {/* Stats row */}
              <div
                className={`grid grid-cols-2 gap-4 pt-4 border-t
                  ${card.isHighlight ? "border-white/20" : "border-outline-variant/20"}`}
              >
                {card.stats.map((stat) => (
                  <div key={stat.label}>
                    <span className={`font-[family-name:var(--font-label)] text-[9px]
                      tracking-widest uppercase block mb-0.5
                      ${card.isHighlight ? "opacity-70" : "text-outline"}`}>
                      {stat.label}
                    </span>
                    <span className={`font-bold font-[family-name:var(--font-label)]`}
                      style={{ fontSize: 14, color: card.isHighlight ? "white" : "#141b2b" }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
