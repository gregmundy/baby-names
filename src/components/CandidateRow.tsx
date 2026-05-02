import type { Candidate } from '../types';
import { labelForTag } from '../lib/features';

type Props = {
  candidate: Candidate;
  listIndex: number;
  isFavorite: boolean;
  recentlyPinned: boolean;
  onTogglePin: () => void;
};

const trendGlyph = { rising: '↗', stable: '→', falling: '↘' } as const;

const CandidateRow = ({
  candidate: c,
  listIndex,
  isFavorite,
  recentlyPinned,
  onTogglePin,
}: Props) => {
  const sexDot = c.sex === 'M' ? 'bg-slate-700' : 'bg-cinnabar';
  const sexLabel = c.sex === 'M' ? 'boy' : 'girl';
  const trendColor =
    c.trend === 'rising'
      ? 'text-cinnabar'
      : c.trend === 'falling'
        ? 'text-ink-soft/60'
        : 'text-ink';

  return (
    <li
      className={`group relative grid grid-cols-[36px_minmax(0,1.4fr)_10px_minmax(0,1fr)_auto] sm:grid-cols-[36px_minmax(0,1.4fr)_10px_minmax(0,1fr)_minmax(0,1.1fr)_auto] items-center gap-x-4 gap-y-1 px-3 py-2.5 border-b border-rule/40 transition-colors duration-200 hover:bg-paper-deep/40 ${
        recentlyPinned ? 'pin-stripe' : ''
      }`}
    >
      <span className="font-display italic text-ink-soft/70 text-[12px] tabular-nums text-right select-none">
        №{String(listIndex + 1).padStart(2, '0')}
      </span>

      <h3
        className={`font-display italic leading-none truncate transition-colors ${
          isFavorite ? 'text-cinnabar' : 'text-ink'
        }`}
        style={{ fontSize: 'clamp(20px, 2.2vw, 26px)' }}
      >
        {c.name}
      </h3>

      <span
        className={`h-1.5 w-1.5 rounded-full ${sexDot}`}
        title={sexLabel}
        aria-label={sexLabel}
      />

      <div className="flex items-center gap-3 font-sans uppercase text-[10px] tracking-[0.2em] text-ink-soft tabular-nums">
        <span>
          r·
          <span className="text-ink font-medium">{c.currentRank ?? '—'}</span>
        </span>
        <span className="hidden md:inline opacity-70">{c.peakDecade}</span>
        <span className={`text-base leading-none ${trendColor}`} aria-hidden>
          {trendGlyph[c.trend]}
        </span>
      </div>

      <ul className="hidden sm:flex flex-wrap gap-1.5 justify-end">
        {c.tags.slice(0, 2).map((t) => (
          <li
            key={t}
            className="font-sans uppercase text-[9px] tracking-[0.16em] text-ink-soft border border-rule rounded-full px-2 py-0.5 whitespace-nowrap"
          >
            {labelForTag[t]}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onTogglePin}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Unpin ${c.name}` : `Pin ${c.name}`}
        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isFavorite
            ? 'bg-cinnabar text-paper scale-100'
            : 'bg-transparent text-ink-soft/60 scale-90 group-hover:scale-100 group-hover:text-ink hover:bg-paper-deep'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <path
            d="M12 2.5l2.6 5.5 6 .8-4.4 4.1 1.1 6L12 16.1 6.7 18.9l1.1-6L3.4 8.8l6-.8L12 2.5z"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
};

export default CandidateRow;
