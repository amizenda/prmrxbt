/**
 * Landing Page — synced from Google Stitch editorial
 * Route: /
 * Design System: "The Intelligence Terminal" — Structured Transparency
 * Source: projects/15202568152459839596/screens/183bfa4b5dcb47c89a0acf6732fe9248
 */
import { LandingTopNavBar } from "@/components/landing/LandingTopNavBar";
import { HeroSection }      from "@/components/landing/HeroSection";
import { TrendingSection }  from "@/components/landing/TrendingSection";
import { NarrativeSection } from "@/components/landing/NarrativeSection";
import { LandingFooter }    from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <LandingTopNavBar />

      {/* Main: pt-14 accounts for fixed top navbar; pb-20 for mobile bottom nav */}
      <main className="flex-1 pt-14 pb-20 lg:pb-0">
        <HeroSection />
        <TrendingSection />
        <NarrativeSection />
      </main>

      <LandingFooter />
    </div>
  );
}
