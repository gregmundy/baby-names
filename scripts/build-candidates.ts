import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import { featuresFor } from '../src/lib/features.ts';
import type {
  Candidate,
  HeuristicTag,
  Sex,
  Trend,
} from '../src/types.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SSA_URL = 'https://www.ssa.gov/oact/babynames/names.zip';
const CACHE_DIR = join(ROOT, 'scripts', '.cache');
const ZIP_PATH = join(CACHE_DIR, 'names.zip');
const OUT_PATH = join(ROOT, 'src', 'data', 'candidates.json');

const log = (msg: string) => console.log(msg);

const ensureZip = async () => {
  mkdirSync(CACHE_DIR, { recursive: true });
  if (existsSync(ZIP_PATH)) {
    log(`✔ using cached ${ZIP_PATH}`);
    return;
  }
  log(`↓ downloading ${SSA_URL}`);
  const res = await fetch(SSA_URL);
  if (!res.ok) {
    throw new Error(`SSA download failed: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(ZIP_PATH, buf);
  log(`✔ saved ${(buf.length / 1e6).toFixed(1)} MB → ${ZIP_PATH}`);
};

type Agg = {
  name: string;
  sex: Sex;
  totalCount: number;
  bestRank: number; // best (lowest) rank ever
  peakYear: number; // year of best rank
  firstYear: number;
  lastYear: number;
  yearCount: number;
  yearsInGoldilocks: number;
  recent: { year: number; rank: number; count: number }[];
};

const lrSlope = (pts: { x: number; y: number }[]) => {
  if (pts.length < 2) return 0;
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + p.x, 0);
  const sy = pts.reduce((s, p) => s + p.y, 0);
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = pts.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sxx - sx * sx;
  if (denom === 0) return 0;
  return (n * sxy - sx * sy) / denom;
};

const main = async () => {
  await ensureZip();

  const zip = new AdmZip(ZIP_PATH);
  const entries = zip
    .getEntries()
    .filter((e) => /^yob\d{4}\.txt$/.test(e.entryName))
    .sort((a, b) => a.entryName.localeCompare(b.entryName));

  if (entries.length === 0) {
    throw new Error('No yobYYYY.txt files found in zip');
  }

  const years = entries.map((e) => parseInt(e.entryName.slice(3, 7)));
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  log(`✔ ${entries.length} year files (${minYear}..${maxYear})`);

  const agg = new Map<string, Agg>();

  for (const entry of entries) {
    const year = parseInt(entry.entryName.slice(3, 7));
    const text = entry.getData().toString('utf8');

    const bySex: Record<Sex, { name: string; count: number }[]> = {
      M: [],
      F: [],
    };
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      const [name, sex, countStr] = t.split(',');
      if (sex !== 'M' && sex !== 'F') continue;
      bySex[sex].push({ name, count: Number(countStr) });
    }

    for (const sex of ['M', 'F'] as const) {
      const list = bySex[sex];
      // SSA file is sorted desc by count within sex, but verify defensively
      list.sort((a, b) => b.count - a.count);
      list.forEach((d, i) => {
        const rank = i + 1;
        const key = `${sex}:${d.name}`;
        let a = agg.get(key);
        if (!a) {
          a = {
            name: d.name,
            sex,
            totalCount: 0,
            bestRank: rank,
            peakYear: year,
            firstYear: year,
            lastYear: year,
            yearCount: 0,
            yearsInGoldilocks: 0,
            recent: [],
          };
          agg.set(key, a);
        }
        a.totalCount += d.count;
        a.lastYear = year;
        a.yearCount += 1;
        if (rank < a.bestRank) {
          a.bestRank = rank;
          a.peakYear = year;
        }
        if (rank >= 200 && rank <= 1000) a.yearsInGoldilocks += 1;
        a.recent.push({ year, rank, count: d.count });
        if (a.recent.length > 5) a.recent.shift();
      });
    }
  }
  log(`✔ aggregated ${agg.size.toLocaleString()} unique (sex, name) pairs`);

  const candidates: Candidate[] = [];
  let kept = 0,
    skipped = 0;
  const tagCounts: Record<HeuristicTag, number> = {
    'rare-not-odd': 0,
    'vintage-revival': 0,
    'sweet-spot-rising': 0,
    'just-emerging': 0,
    'long-arc-classic': 0,
    goldilocks: 0,
  };

  for (const a of agg.values()) {
    const isCurrent = a.lastYear === maxYear;
    const currentRank = isCurrent
      ? a.recent[a.recent.length - 1].rank
      : null;

    const slope = lrSlope(a.recent.map((r) => ({ x: r.year, y: r.rank })));
    // Negative slope on rank ⇒ rank shrinking ⇒ popularity rising.
    const trend: Trend = slope < -8 ? 'rising' : slope > 8 ? 'falling' : 'stable';
    const trendSlope = Number((-slope).toFixed(2));

    const tags: HeuristicTag[] = [];

    // Long-arc classic: present nearly every year, never a megahit, but consistently visible.
    const yearsAvailable = maxYear - minYear + 1;
    if (
      a.firstYear <= minYear + 2 &&
      a.yearCount >= yearsAvailable - 3 &&
      a.bestRank > 30 &&
      a.bestRank <= 250
    ) {
      tags.push('long-arc-classic');
    }

    // Vintage revival: peaked ≥50y ago, faded, currently rising.
    if (
      maxYear - a.peakYear >= 50 &&
      trend === 'rising' &&
      currentRank !== null &&
      currentRank > a.bestRank * 3
    ) {
      tags.push('vintage-revival');
    }

    // Sweet-spot rising: in [100, 800] now and rising.
    if (
      currentRank !== null &&
      currentRank >= 100 &&
      currentRank <= 800 &&
      trend === 'rising'
    ) {
      tags.push('sweet-spot-rising');
    }

    // Just emerging: first appeared after 1985, in top 1000 now, not falling.
    if (
      a.firstYear >= 1985 &&
      currentRank !== null &&
      currentRank <= 1000 &&
      trend !== 'falling'
    ) {
      tags.push('just-emerging');
    }

    // Goldilocks: ≥80% of observed years inside rank [200,1000].
    if (a.yearCount >= 30 && a.yearsInGoldilocks / a.yearCount >= 0.8) {
      tags.push('goldilocks');
    }

    // Rare-but-not-odd: currently rank 500–1500 with real history.
    if (
      currentRank !== null &&
      currentRank > 500 &&
      currentRank <= 1500 &&
      a.totalCount >= 1500
    ) {
      tags.push('rare-not-odd');
    }

    // Filter: keep currently-relevant or historically-significant or tagged names.
    const keep =
      (currentRank !== null && currentRank <= 1500) ||
      (a.bestRank <= 100 && a.totalCount >= 50_000) ||
      tags.length > 0;

    if (!keep) {
      skipped += 1;
      continue;
    }
    kept += 1;
    for (const t of tags) tagCounts[t] += 1;

    const features = featuresFor(a.name);
    candidates.push({
      name: a.name,
      sex: a.sex,
      currentRank,
      totalCount: a.totalCount,
      peakYear: a.peakYear,
      peakRank: a.bestRank,
      peakDecade: `${Math.floor(a.peakYear / 10) * 10}s`,
      firstYear: a.firstYear,
      trend,
      trendSlope,
      tags,
      ...features,
    });
  }

  candidates.sort((a, b) => {
    const ra = a.currentRank ?? 99999;
    const rb = b.currentRank ?? 99999;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });

  log(`✔ kept ${kept.toLocaleString()}, skipped ${skipped.toLocaleString()}`);
  log(`  tag distribution:`);
  for (const [tag, n] of Object.entries(tagCounts)) {
    log(`    ${tag.padEnd(20)} ${n.toLocaleString()}`);
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  const json = JSON.stringify(candidates);
  writeFileSync(OUT_PATH, json);
  log(`✔ wrote ${OUT_PATH} (${(json.length / 1e6).toFixed(2)} MB)`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
