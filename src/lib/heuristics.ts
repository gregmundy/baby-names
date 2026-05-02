import type {
  Candidate,
  CuratedList,
  SexFilter,
  ShortlistEntry,
  SortKey,
} from '../types';
import { featuresFor } from './features';

const avg = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;

export const siblingFitScore = (
  candidate: Candidate,
  shortlist: ShortlistEntry[]
): number => {
  if (shortlist.length === 0) return 0;
  const ref = shortlist.map((e) => featuresFor(e.name));
  const avgSyl = avg(ref.map((f) => f.syllables));
  const avgLen = avg(ref.map((f) => f.length));
  const endings = new Set(ref.map((f) => f.endsWith));

  let score = 0;
  if (Math.abs(candidate.syllables - avgSyl) <= 0.6) score += 3;
  else if (Math.abs(candidate.syllables - avgSyl) <= 1.2) score += 1;
  if (endings.has(candidate.endsWith)) score += 2;
  if (Math.abs(candidate.length - avgLen) <= 1) score += 1;
  return score;
};

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
    shortlist: ShortlistEntry[];
  }
): Candidate[] => {
  const q = opts.search.trim().toLowerCase();

  let filtered = pool.filter((c) => {
    if (opts.sex !== 'all' && c.sex !== opts.sex) return false;
    if (q && !c.name.toLowerCase().includes(q)) return false;
    if (opts.curated !== 'all' && opts.curated !== 'sibling-fit') {
      if (!c.tags.includes(opts.curated)) return false;
    }
    return true;
  });

  if (opts.curated === 'sibling-fit') {
    const scored = filtered
      .map((c) => ({ c, s: siblingFitScore(c, opts.shortlist) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    return scored.map((x) => x.c);
  }

  const cmp: Record<SortKey, (a: Candidate, b: Candidate) => number> = {
    'rank-asc': (a, b) =>
      (a.currentRank ?? 9999) - (b.currentRank ?? 9999),
    'rank-desc': (a, b) =>
      (b.currentRank ?? 0) - (a.currentRank ?? 0),
    trend: (a, b) =>
      trendOrder[a.trend] - trendOrder[b.trend] ||
      (a.currentRank ?? 9999) - (b.currentRank ?? 9999),
    alpha: (a, b) => a.name.localeCompare(b.name),
  };

  return filtered.slice().sort(cmp[opts.sort]);
};
