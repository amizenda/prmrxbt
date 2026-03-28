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
  // Pagination metadata
  page: number;
  limit: number;
  totalPages: number;
}
