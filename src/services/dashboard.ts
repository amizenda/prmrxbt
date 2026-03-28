/**
 * Dashboard service — builds the ecosystem overview response.
 * TODO (production): Replace stub with real data from on-chain indexer
 *   (e.g., Dune, Basescan, GeckoTerminal, or a custom The Graph subgraph).
 */

import type { DashboardResponse } from "@/types/dashboard";

export function buildDashboardResponse(): DashboardResponse {
  return {
    overview: {
      totalProjects: 0,
      totalVolume24h: 0,
      activeWallets: 0,
    },
    regions: [],
    trendingNow: [],
    lastUpdated: new Date().toISOString(),
  };
}
