import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  CandidateRow,
  CorkboardModal,
  CuratedTabs,
  FilterBar,
  PinnedRail,
} from './components';
import { candidates } from './data/candidates';
import { filterAndSort } from './lib/heuristics';
import { useShortlist } from './lib/useShortlist';
import type {
  CuratedList,
  HeuristicTag,
  SexFilter,
  ShortlistEntry,
  SortKey,
} from './types';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

const VISIBLE_CAP = 80;

const App = () => {
  const { list, isFavorite, toggleFavorite, remove } = useShortlist();

  const [sex, setSex] = useState<SexFilter>('all');
  const [curated, setCurated] = useState<CuratedList>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('rank-asc');
  const [expanded, setExpanded] = useState(false);
  const [corkboardOpen, setCorkboardOpen] = useState(false);
  const [pulseKey, setPulseKey] = useState<string | null>(null);

  const results = useMemo(
    () =>
      filterAndSort(candidates, {
        sex,
        curated,
        search,
        sort,
        shortlist: list,
      }),
    [sex, curated, search, sort, list]
  );

  useEffect(() => setExpanded(false), [sex, curated, search, sort]);

  const tabCounts = useMemo(() => {
    const counts: Partial<Record<CuratedList, number>> = {
      all: candidates.length,
    };
    const tagKeys: HeuristicTag[] = [
      'rare-not-odd',
      'vintage-revival',
      'sweet-spot-rising',
      'just-emerging',
      'long-arc-classic',
      'goldilocks',
    ];
    for (const k of tagKeys) counts[k] = 0;
    for (const c of candidates) {
      for (const t of c.tags) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return counts;
  }, []);

  const siblingFitDisabled = list.length === 0;
  const showSiblingHint = curated === 'sibling-fit' && siblingFitDisabled;
  const visible = expanded ? results : results.slice(0, VISIBLE_CAP);
  const hiddenCount = results.length - visible.length;

  const handleTogglePin = (entry: ShortlistEntry) => {
    toggleFavorite(entry);
    const key = `${entry.sex}:${entry.name}`;
    setPulseKey(key);
    window.setTimeout(() => {
      setPulseKey((curr) => (curr === key ? null : curr));
    }, 850);
  };

  return (
    <div className="paper-grain paper-vignette relative min-h-screen overflow-x-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-cinnabar/10 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-[40%] -right-40 w-[520px] h-[520px] rounded-full bg-tape/30 blur-3xl"
      />

      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 pt-12 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-y-6 gap-x-8">
          <div>
            <p
              className="ink-rise font-sans uppercase tracking-[0.42em] text-[11px] text-ink-soft"
              style={delay(0)}
            >
              A Shortlist · MMXXVI · No. 01
            </p>
            <h1
              className="ink-rise mt-3 font-display font-light text-ink leading-[0.92] tracking-[-0.02em]"
              style={{
                ...delay(120),
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontVariationSettings: '"opsz" 144, "SOFT" 80',
              }}
            >
              <span className="italic">Baby</span>{' '}
              <span className="font-medium">Names</span>
              <span className="text-cinnabar">.</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setCorkboardOpen(true)}
            disabled={list.length === 0}
            className="ink-rise font-sans uppercase tracking-[0.3em] text-[11px] text-ink hover:text-cinnabar disabled:text-ink-soft/40 disabled:cursor-not-allowed border-b border-cinnabar/70 hover:border-cinnabar pb-1 transition-colors flex items-center gap-2"
            style={delay(200)}
          >
            <span className="tabular-nums">
              {String(list.length).padStart(2, '0')}
            </span>
            <span>pinned</span>
            <span className="opacity-60">·</span>
            <span>open corkboard</span>
            <span className="text-base">↗</span>
          </button>
        </div>
      </header>

      {/* ── Sticky control band ──────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-y border-rule bg-paper/92 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-3 space-y-3">
          <CuratedTabs
            value={curated}
            onChange={setCurated}
            hasShortlist={!siblingFitDisabled}
            counts={tabCounts}
          />
          <FilterBar
            sex={sex}
            onSexChange={setSex}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            resultCount={results.length}
          />
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <main className="relative z-0 mx-auto max-w-7xl px-6 sm:px-10 pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-x-12 gap-y-12 items-start">
          {/* Catalog */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display italic text-xl text-ink">
                The Catalog
              </h2>
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-ink-soft">
                {candidates.length.toLocaleString()} candidates · ssa
                1880–2024
              </span>
            </div>

            {showSiblingHint ? (
              <div className="mt-8 border border-dashed border-rule rounded-md py-12 text-center">
                <p className="font-display italic text-lg text-ink-soft">
                  Pin at least one name to see siblings.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="mt-8 border border-dashed border-rule rounded-md py-12 text-center">
                <p className="font-display italic text-lg text-ink-soft">
                  No candidates match these filters.
                </p>
              </div>
            ) : (
              <>
                <ol className="border-y border-rule/60 divide-y divide-rule/40">
                  {visible.map((c, i) => {
                    const entry: ShortlistEntry = { name: c.name, sex: c.sex };
                    const key = `${c.sex}:${c.name}`;
                    return (
                      <CandidateRow
                        key={key}
                        candidate={c}
                        listIndex={i}
                        isFavorite={isFavorite(entry)}
                        onTogglePin={() => handleTogglePin(entry)}
                        recentlyPinned={pulseKey === key}
                      />
                    );
                  })}
                </ol>
                {hiddenCount > 0 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="font-display italic text-base text-ink border-b border-cinnabar pb-1 hover:text-cinnabar transition-colors"
                    >
                      show {hiddenCount.toLocaleString()} more
                    </button>
                  </div>
                )}
                {expanded && results.length > VISIBLE_CAP && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setExpanded(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-sans uppercase tracking-[0.3em] text-[10px] text-ink-soft hover:text-ink"
                    >
                      collapse
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Pinned rail */}
          <PinnedRail
            list={list}
            onRemove={remove}
            onOpenCorkboard={() => setCorkboardOpen(true)}
          />
        </div>

        <footer className="mt-24 border-t border-rule pt-8 pb-2 text-center">
          <p className="font-display text-lg text-ink leading-relaxed">
            Made with{' '}
            <span className="text-cinnabar" aria-label="love">
              ❤
            </span>{' '}
            for <span className="italic">Anna</span> &amp;{' '}
            <span className="italic">Cora</span>
          </p>
          <p className="mt-2 font-display italic text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            (who would've been named Tomax and Xamot if it weren't for their
            very wise mother)
          </p>
          <div className="mt-8 flex items-end justify-between text-ink-soft">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px]">
              est. 2019
            </span>
            <span className="font-display italic text-base">— fin —</span>
            <span className="font-sans uppercase tracking-[0.3em] text-[10px]">
              ssa national · 1880–2024
            </span>
          </div>
        </footer>
      </main>

      <CorkboardModal
        open={corkboardOpen}
        onClose={() => setCorkboardOpen(false)}
        list={list}
        onRemove={remove}
      />
    </div>
  );
};

export default App;
