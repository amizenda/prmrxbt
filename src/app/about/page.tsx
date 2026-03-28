"use client";

/**
 * About — Route: /about
 * prmrxbt — Premier Base's AI Brain
 * Design System: The Technical Curator
 */

const FEATURES = [
  {
    icon: "◈",
    title: "AI Signal Engine",
    desc: "Real-time AI analysis of on-chain activity surfaces high-confidence signals before the market moves.",
  },
  {
    icon: "◉",
    title: "Real-time On-chain Data",
    desc: "Live TVL, volume, gas, and wallet tracking across the entire Base ecosystem — all in one terminal.",
  },
  {
    icon: "◎",
    title: "Community Intelligence",
    desc: "Aggregated social + developer signals from the Base ecosystem's most active communities.",
  },
  {
    icon: "◇",
    title: "Free to Use",
    desc: "No sign-up, no API key, no cost. Built for builders and researchers who move fast.",
  },
];

const STATS = [
 { value: "500+", label: "PROJECTS TRACKED" },
  { value: "Real-time", label: "SIGNALS" },
  { value: "Free", label: "FOREVER" },
  { value: "< 100ms", label: "RESPONSE TIME" },
];

const STACK = [
  "Next.js 16",
  "TypeScript",
  "Base",
  "AI",
  "Tailwind CSS",
  "OpenClaw",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9f9ff]">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="mb-3 text-[#0052FF] font-mono text-xs tracking-[0.12em] uppercase">
          prmrxbt — v1.0.0
        </div>
        <h1
          className="text-[#141b2b] font-black leading-tight mb-6"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
        >
          Premier Base's
          <br />
          <span className="text-[#0052FF]">AI Brain.</span>
        </h1>
        <p className="text-[#434656] text-lg leading-relaxed max-w-2xl mb-8">
          prmrxbt is an intelligence terminal for the Base ecosystem — built to surface
          smarter signals, faster decisions, and deeper on-chain context for traders,
          researchers, and builders.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#003ec7] to-[#0052FF] text-white font-semibold px-6 py-3 rounded-[2px] text-sm tracking-wide hover:brightness-110 transition-all"
        >
          GET STARTED →
        </a>
      </section>

      {/* ── Divider ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[rgba(195,197,217,0.4)]" />
      </div>

      {/* ── Mission ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="text-[#0052FF] font-mono text-xs tracking-[0.12em] uppercase mb-4">
              MISSION
            </div>
            <h2
              className="text-[#141b2b] font-bold leading-tight mb-4"
              style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}
            >
              Structured Transparency
            </h2>
            <p className="text-[#434656] leading-relaxed mb-4">
              We believe the best intelligence is organized intelligence. prmrxbt doesn't
              just show you data — it organizes, prioritizes, and contextualizes it
              so you can act faster and with more confidence.
            </p>
            <p className="text-[#434656] leading-relaxed">
              Built on Base for Base. No gatekeeping, no paywalls, no noise — just
              the signals that matter.
            </p>
          </div>
          <div className="border border-[rgba(195,197,217,0.4)] rounded-[2px] p-6 bg-[#e9edff]">
            <div className="text-[#0052FF] font-mono text-xs tracking-[0.12em] uppercase mb-4">
              PLATFORM STATS
            </div>
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="text-[#141b2b] font-bold"
                    style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[#737688] font-mono text-xs tracking-[0.05em] uppercase mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[rgba(195,197,217,0.4)]" />
      </div>

      {/* ── Features ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-[#0052FF] font-mono text-xs tracking-[0.12em] uppercase mb-4">
          CAPABILITIES
        </div>
        <h2
          className="text-[#141b2b] font-bold leading-tight mb-10"
          style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}
        >
          Built for Speed and Clarity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border border-[rgba(195,197,217,0.4)] rounded-[2px] p-6 bg-[#ffffff]"
            >
              <div className="text-[#0052FF] text-2xl mb-3">{f.icon}</div>
              <div
                className="text-[#141b2b] font-bold mb-2"
                style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
              >
                {f.title}
              </div>
              <p className="text-[#434656] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[rgba(195,197,217,0.4)]" />
      </div>

      {/* ── Tech Stack ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-[#0052FF] font-mono text-xs tracking-[0.12em] uppercase mb-4">
          BUILT WITH
        </div>
        <h2
          className="text-[#141b2b] font-bold leading-tight mb-8"
          style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}
        >
          Technology Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="border border-[rgba(195,197,217,0.4)] text-[#434656] font-mono text-xs tracking-[0.05em] uppercase px-3 py-1.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[rgba(195,197,217,0.4)]" />
      </div>

      {/* ── Team ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-[#0052FF] font-mono text-xs tracking-[0.12em] uppercase mb-4">
          TEAM
        </div>
        <div className="border border-[rgba(195,197,217,0.4)] rounded-[2px] p-6 bg-[#ffffff] max-w-md">
          <div
            className="text-[#141b2b] font-bold mb-1"
            style={{ fontSize: "1.125rem" }}
          >
            Nam Nguyen Trung
          </div>
          <div className="text-[#737688] font-mono text-xs tracking-[0.05em] uppercase mb-4">
            FOUNDER / BUILDER
          </div>
          <div className="flex gap-3">
            <a
              href="#"
              className="text-[#0052FF] font-mono text-xs tracking-[0.05em] uppercase hover:underline"
            >
              X / TWITTER
            </a>
            <a
              href="#"
              className="text-[#0052FF] font-mono text-xs tracking-[0.05em] uppercase hover:underline"
            >
              GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-[rgba(195,197,217,0.4)] bg-[#e1e8fd] mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[#0052FF] font-black text-sm tracking-widest">
            PRMRXBT
          </div>
          <div className="text-[#737688] font-mono text-xs tracking-[0.05em] uppercase">
            © 2026 — BUILT ON BASE
          </div>
          <div className="flex gap-4">
            {["DASHBOARD", "ECOSYSTEM", "INTELLIGENCE", "TERMINAL"].map((link) => (
              <a
                key={link}
                href={`/${link.toLowerCase()}`}
                className="text-[#737688] font-mono text-xs tracking-[0.05em] uppercase hover:text-[#0052FF]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
