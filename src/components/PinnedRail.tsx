import type { ShortlistEntry } from '../types';

type Props = {
  list: ShortlistEntry[];
  onRemove: (entry: ShortlistEntry) => void;
  onOpenCorkboard: () => void;
};

const PinnedRail = ({ list, onRemove, onOpenCorkboard }: Props) => {
  return (
    <aside className="lg:flex lg:flex-col lg:h-full lg:min-h-0 lg:pl-10 lg:border-l lg:border-rule">
      <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-rule shrink-0">
        <h2 className="font-display italic text-xl text-ink">Pinned</h2>
        <span className="font-sans uppercase text-[10px] tracking-[0.3em] text-ink-soft tabular-nums">
          {String(list.length).padStart(2, '0')}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="font-display italic text-sm text-ink-soft leading-relaxed">
          Nothing yet. Pin a name from the catalog and it lands here.
        </p>
      ) : (
        <ul className="space-y-2 lg:flex-1 lg:overflow-y-auto lg:min-h-0 lg:pr-1">
          {list.map((entry, i) => {
            const rotation = ((i % 3) - 1) * 0.6;
            const sexDot = entry.sex === 'M' ? 'bg-slate-700' : 'bg-cinnabar';
            return (
              <li
                key={`${entry.sex}:${entry.name}`}
                className="group relative flex items-center gap-2.5 bg-paper border border-rule rounded-md pl-3 pr-1.5 py-1.5 shadow-[0_2px_4px_-2px_rgba(60,30,10,0.25)] hover:shadow-[0_6px_12px_-4px_rgba(60,30,10,0.35)] transition-all duration-200"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionTimingFunction: 'cubic-bezier(0.2,0.8,0.2,1)',
                }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${sexDot} shrink-0`}
                  aria-hidden
                />
                <span className="font-display italic text-base text-ink truncate flex-1 leading-tight">
                  {entry.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(entry)}
                  aria-label={`Unpin ${entry.name}`}
                  className="h-6 w-6 rounded-full flex items-center justify-center text-ink-soft opacity-0 group-hover:opacity-100 hover:text-cinnabar focus:opacity-100 transition-opacity"
                >
                  <span className="text-base leading-none -mt-px">×</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={onOpenCorkboard}
        disabled={list.length === 0}
        className="mt-6 w-full text-left font-display italic text-sm text-ink hover:text-cinnabar disabled:text-ink-soft/40 disabled:cursor-not-allowed border-t border-rule pt-4 transition-colors flex items-center justify-between shrink-0"
      >
        <span>open corkboard</span>
        <span className="text-base">↗</span>
      </button>
    </aside>
  );
};

export default PinnedRail;
