"use client";

/**
 * Leaderboard — matches Stitch HTML exactly
 * Base Everything Intelligence Terminal
 */

export interface LeaderboardEntry {
  rank: number;
  project: string;
  mindshare: string;
  volume24h: string;
  baseScore: number;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
  onViewAll?: () => void;
}

const DEFAULT_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, project: "Aerodrome", mindshare: "42.4%", volume24h: "$82.1M", baseScore: 98.4 },
  { rank: 2, project: "Base Name Service", mindshare: "21.8%", volume24h: "$4.2M", baseScore: 89.1 },
  { rank: 3, project: "DackieSwap", mindshare: "18.2%", volume24h: "$1.8M", baseScore: 84.5 },
];

function ScoreBadge({ score, rank }: { score: number; rank: number }) {
  const isTop = rank === 1;
  return (
    <span
      className={[
        "px-2 py-1 font-black rounded-sm font-mono",
        isTop
          ? "bg-primary-fixed text-primary"
          : "bg-surface-container-highest text-on-surface",
      ].join(" ")}
    >
      {score.toFixed(1)}
    </span>
  );
}

export function Leaderboard({
  entries = DEFAULT_ENTRIES,
  onViewAll,
}: LeaderboardProps) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-sm">
      {/* Header row */}
      <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center">
        <h2 className="font-bold text-sm font-mono tracking-widest uppercase text-on-surface">
          Ecosystem Leaderboard (Preview)
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-primary font-mono uppercase tracking-tight flex items-center gap-1 hover:opacity-80 transition-all"
        >
          View Full Terminal
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low font-mono text-[10px] font-bold uppercase tracking-widest text-outline">
            <tr>
              <th className="px-6 py-3 font-medium">Rank</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium text-right">Mindshare</th>
              <th className="px-6 py-3 font-medium text-right">24H Volume</th>
              <th className="px-6 py-3 font-medium text-right">Premier Base Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-mono text-xs text-on-surface">
            {entries.map((entry) => {
              const isTop = entry.rank === 1;
              return (
                <tr
                  key={entry.rank}
                  className="hover:bg-surface-container transition-all"
                >
                  <td className={`px-6 py-4 font-bold ${isTop ? "text-primary" : "text-on-surface"}`}>
                    {String(entry.rank).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4 font-bold">{entry.project}</td>
                  <td className="px-6 py-4 text-right">{entry.mindshare}</td>
                  <td className="px-6 py-4 text-right">{entry.volume24h}</td>
                  <td className="px-6 py-4 text-right">
                    <ScoreBadge score={entry.baseScore} rank={entry.rank} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
