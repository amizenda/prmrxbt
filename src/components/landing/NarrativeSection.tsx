"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────
// Narrative Section — synced from Stitch editorial
// Design: "Ecosystem Momentum" + 3 sector insight cards
// ─────────────────────────────────────────────────────────

const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const GLOBAL_STATS = [
  { label: "Total_Projects", value: "1,284" },
  { label: "Active_Users",   value: "1.2M"  },
  { label: "Market_Cap",     value: "$4.2B" },
];

const CARDS = [
  {
    icon:  "neurology",
    title: "AI Agent Meta",
    badge: { label: "HEATING UP", bg: "bg-tertiary-container/10", text: "text-tertiary-container" },
    score: 94,
    projects: ["Virtuals Protocol", "BaseGod AI"],
  },
  {
    icon:  "token",
    title: "Creator Coins",
    badge: { label: "STABLE", bg: "bg-primary/10", text: "text-primary" },
    score: 78,
    projects: ["Moxie", "Degen L3"],
  },
  {
    icon:  "account_balance",
    title: "RWA / Yield",
    badge: { label: "NEW ENTRY", bg: "bg-primary/10", text: "text-primary" },
    score: 62,
    projects: ["Mountain Protocol", "Ondo Finance"],
  },
];

export function NarrativeSection() {
  return (
    <section className="bg-surface-container-low border-y border-outline-variant/40 py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section header row */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          {/* Left: label + heading + description */}
          <div className="max-w-xl">
            <span className="font-[family-name:var(--font-label)] text-[11px] font-bold
              tracking-[0.2em] text-primary uppercase block mb-2">
              Narrative_Intelligence
            </span>
            <h2 className="text-4xl font-black tracking-tighter text-on-surface uppercase
              mb-4 font-[family-name:var(--font-headline)]">
              Ecosystem Momentum
            </h2>
            <p className="text-on-surface-variant font-medium text-base">
              Tracking the velocity of capital and attention across emerging sectors on Base.
            </p>
          </div>

          {/* Right: 3 global metric callouts */}
          <div className="grid grid-cols-3 gap-8">
            {GLOBAL_STATS.map((stat) => (
              <div key={stat.label}>
                <span className="font-[family-name:var(--font-label)] text-[10px]
                  tracking-widest uppercase text-outline block mb-1">
                  {stat.label}
                </span>
                <span className="text-3xl font-black tabular-nums font-[family-name:var(--font-headline)]
                  text-on-surface">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3-column narrative cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
            >
              <article className="bg-surface-container-lowest border border-outline-variant/40 p-8
                rounded-sm hover:border-primary/40 transition-all h-full">

                {/* Card header: icon + title + badge */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/10 text-primary rounded-sm">
                    <span className="material-symbols-outlined text-xl">{card.icon}</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tighter uppercase
                    font-[family-name:var(--font-headline)] text-on-surface">
                    {card.title}
                  </h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full font-[family-name:var(--font-label)]
                    text-[10px] font-bold ${card.badge.bg} ${card.badge.text}`}>
                    {card.badge.label}
                  </span>
                </div>

                {/* Momentum score + progress bar */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Momentum Score</span>
                    <span className="font-mono font-bold text-on-surface">
                      {card.score}/100
                    </span>
                  </div>
                  {/* 1px progress bar */}
                  <div className="w-full h-1 bg-surface-container-high rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-sm"
                      style={{ width: `${card.score}%` }}
                    />
                  </div>
                </div>

                {/* Top Projects */}
                <div className="space-y-3">
                  <span className="font-[family-name:var(--font-label)] text-[10px]
                    tracking-widest uppercase text-outline block">
                    Top Projects
                  </span>
                  {card.projects.map((name) => (
                    <Link
                      key={name}
                      href="/ecosystem"
                      className="flex items-center justify-between p-3
                        border border-outline-variant/20 hover:border-primary/40
                        transition-all rounded-sm group"
                    >
                      <span className="text-sm font-bold uppercase text-on-surface
                        font-[family-name:var(--font-label)]">
                        {name}
                      </span>
                      <span className="material-symbols-outlined text-sm text-primary
                        group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        north_east
                      </span>
                    </Link>
                  ))}
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
