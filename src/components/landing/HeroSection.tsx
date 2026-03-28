"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────
// Hero Section — Editorial layout synced from Stitch
// Design: "The Intelligence Terminal"
// ─────────────────────────────────────────────────────────

const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// Sparkline bar data
const SPARKLINE = [40, 60, 50, 80, 100];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-outline-variant/40 bg-surface">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[716px]">

        {/* ── Left: Hero Content ── */}
        <div className="lg:col-span-6 p-8 lg:p-16 flex flex-col justify-center">
          {/* Ecosystem Live pill */}
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={FADE_UP}
            className="inline-flex items-center gap-2 px-3 py-1
              bg-secondary-container/20 text-primary border border-primary/20
              rounded-full w-fit mb-6"
          >
            <span
              className="font-[family-name:var(--font-label)] text-[10px] font-bold
                tracking-widest uppercase"
            >
              Ecosystem Live
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>

          {/* H1 */}
          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={FADE_UP}
            className="text-5xl lg:text-7xl font-black tracking-tighter text-on-surface mb-6
              leading-[0.9] font-[family-name:var(--font-headline)]"
          >
            Base Everything:
            <br />
            <span className="text-primary">The living map of Base</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2} initial="hidden" animate="visible" variants={FADE_UP}
            className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed font-medium
              font-[family-name:var(--font-body)]"
          >
            Explore projects, narratives, metrics, and relationships across the Base ecosystem.
            Your terminal for high-density intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3} initial="hidden" animate="visible" variants={FADE_UP}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary-container text-on-primary
                px-8 py-4 font-bold uppercase tracking-tight text-sm rounded-sm
                transition-all font-[family-name:var(--font-label)]"
            >
              Explore Ecosystem
            </Link>

            <Link
              href="/trending"
              className="border border-outline text-on-surface px-8 py-4 font-bold
                uppercase tracking-tight text-sm rounded-sm
                hover:bg-surface-container transition-all
                font-[family-name:var(--font-label)]"
            >
              View Trending
            </Link>

            <Link
              href="/submit"
              className="text-primary font-bold uppercase tracking-tight text-sm px-4 py-4
                hover:underline font-[family-name:var(--font-label)]"
            >
              Submit Project
            </Link>
          </motion.div>
        </div>

        {/* ── Right: Editorial Modular 6×6 Grid ── */}
        <div className="lg:col-span-6 bg-surface-container-low border-l border-outline-variant/40
          p-6 grid grid-cols-6 grid-rows-6 gap-2">

          {/* ── DeFi Card — col-span-4, row-span-3 ── */}
          <div
            className="col-span-4 row-span-3 bg-primary p-6 flex flex-col justify-between
              border border-primary text-on-primary rounded-sm"
          >
            <span
              className="font-[family-name:var(--font-label)] text-[10px] tracking-widest
                uppercase opacity-80"
            >
              Sector_01
            </span>
            <div>
              <h3 className="text-3xl font-black leading-none mb-2
                font-[family-name:var(--font-headline)]">DEFI</h3>
              <p className="text-sm opacity-90 max-w-[200px] leading-snug">
                Liquidity anchors &amp; automated markets.
              </p>
            </div>
          </div>

          {/* ── AI Card — col-span-2, row-span-2 ── */}
          <div
            className="col-span-2 row-span-2 bg-surface-container-lowest
              border border-outline-variant/40 p-4 flex flex-col justify-between
              rounded-sm"
          >
            <span className="material-symbols-outlined text-primary text-2xl">memory</span>
            <h3 className="text-xl font-black tracking-tighter uppercase
              font-[family-name:var(--font-headline)]">AI</h3>
          </div>

          {/* ── Social Card — col-span-2, row-span-2 ── */}
          <div
            className="col-span-2 row-span-2 bg-surface-container-lowest
              border border-outline-variant/40 p-4 flex flex-col justify-between
              rounded-sm"
          >
            <span className="material-symbols-outlined text-primary text-2xl">group</span>
            <h3 className="text-xl font-black tracking-tighter uppercase
              font-[family-name:var(--font-headline)]">Social</h3>
          </div>

          {/* ── Stats Card — col-span-4, row-span-3 ── */}
          <div
            className="col-span-4 row-span-3 bg-surface-container-highest
              border border-outline-variant/40 p-6 rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-[family-name:var(--font-label)] text-[10px]
                tracking-widest uppercase">Ecosystem_Pulse</span>
              <span className="text-primary font-bold text-xs
                font-[family-name:var(--font-label)]">+14.2%</span>
            </div>
            {/* 1px stroke sparkline — no fill */}
            <div className="h-24 flex items-end gap-1">
              {SPARKLINE.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary rounded-sm"
                  style={{
                    height: `${h}%`,
                    opacity: i === SPARKLINE.length - 1 ? 1 : 0.3 + (i / SPARKLINE.length) * 0.5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Infra Card — col-span-2, row-span-1 ── */}
          <div
            className="col-span-2 row-span-1 bg-tertiary-container text-on-tertiary-container
              p-4 flex items-center justify-between rounded-sm"
          >
            <span className="font-[family-name:var(--font-label)] text-[10px] font-bold tracking-widest">
              INFRA
            </span>
            <span className="material-symbols-outlined text-sm">bolt</span>
          </div>
        </div>

      </div>
    </section>
  );
}
