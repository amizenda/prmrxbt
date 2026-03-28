/**
 * Dashboard Types — shared between all dashboard APIs and the frontend.
 */

import type { ProjectCategory } from '@/services/ecosystem';

// ─── Dashboard overview ───────────────────────────────────────────────────────

export interface RegionSummary {
  id: ProjectCategory;
  name: string;
  projectCount: number;
  volume24h: number;    // USD
  tvl: number;          // USD
  activeWallets: number;
  active: boolean;
  color: string;
  icon: string;
}

export interface TrendingNowEntry {
  project: string;
  change: number;      // % 24h
  type: 'surge' | 'new' | 'viral' | 'airdrop' | 'listing' | 'partnership';
  category: ProjectCategory;
}

export interface DashboardOverview {
  totalProjects: number;
  totalVolume24h: number;    // USD
  totalTvl: number;          // USD
  activeWallets: number;
  newProjectsThisWeek: number;
  volumeChange24h: number;    // %
  avgGasPriceGwei: number;
}

export interface DashboardResponse {
  overview: DashboardOverview;
  regions: RegionSummary[];
  trendingNow: TrendingNowEntry[];
  lastUpdated: string;       // ISO-8601
}

// ─── Region detail ────────────────────────────────────────────────────────────

export interface RegionProject {
  id: string;
  name: string;
  tvl: number;         // USD
  volume24h: number;   // USD
  users: number;
  trend: 'up' | 'down' | 'neutral';
  trendPct: number;
  verified: boolean;
  tags: string[];
  description?: string;
  url?: string;
}

export interface RegionResponse {
  id: ProjectCategory;
  name: string;
  description: string;
  projectCount: number;
  volume24h: number;
  tvl: number;
  activeWallets: number;
  growth24h: number;   // %
  projects: RegionProject[];
  updatedAt: string;
}
