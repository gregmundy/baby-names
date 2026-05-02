import type { Candidate, CuratedList, SexFilter, SortKey } from '../types';

export const rotationFor = (name: string): number => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const steps = ((h % 7) + 7) % 7; // 0..6
  return (steps - 3) * 0.9; // -2.7°..+2.7°
};

const trendOrder = { rising: 0, stable: 1, falling: 2 } as const;

export const filterAndSort = (
  pool: Candidate[],
  opts: {
    sex: SexFilter;
    curated: CuratedList;
    search: string;
    sort: SortKey;
  }
): Candidate[] => {
  const q = opts.search.trim().toLowerCase();

  const filtered = pool.filter((c) => {
    if (opts.sex !== 'all' && c.sex !== opts.sex) return false;
    if (q && !c.name.toLowerCase().includes(q)) return false;
    if (opts.curated !== 'all' && !c.tags.includes(opts.curated)) return false;
    return true;
  });

  const cmp: Record<SortKey, (a: Candidate, b: Candidate) => number> = {
    'rank-asc': (a, b) => (a.currentRank ?? 9999) - (b.currentRank ?? 9999),
    'rank-desc': (a, b) => (b.currentRank ?? 0) - (a.currentRank ?? 0),
    trend: (a, b) =>
      trendOrder[a.trend] - trendOrder[b.trend] ||
      (a.currentRank ?? 9999) - (b.currentRank ?? 9999),
    alpha: (a, b) => a.name.localeCompare(b.name),
  };

  return filtered.slice().sort(cmp[opts.sort]);
};
