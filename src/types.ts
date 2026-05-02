export type Sex = 'M' | 'F';

export type HeuristicTag =
  | 'rare-not-odd'
  | 'vintage-revival'
  | 'sweet-spot-rising'
  | 'just-emerging'
  | 'long-arc-classic'
  | 'goldilocks';

export type Trend = 'rising' | 'stable' | 'falling';

export type Candidate = {
  name: string;
  sex: Sex;
  currentRank: number | null;
  totalCount: number;
  peakYear: number;
  peakRank: number;
  peakDecade: string;
  firstYear: number;
  trend: Trend;
  trendSlope: number;
  tags: HeuristicTag[];
  syllables: number;
  startsWith: string;
  endsWith: string;
  length: number;
};

export type ShortlistEntry = {
  name: string;
  sex: Sex;
};

export type CuratedList = 'all' | HeuristicTag;

export type SortKey = 'rank-asc' | 'rank-desc' | 'trend' | 'alpha';

export type SexFilter = 'all' | Sex;
