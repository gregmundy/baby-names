import type { SexFilter, SortKey } from '../types';

type Props = {
  sex: SexFilter;
  onSexChange: (s: SexFilter) => void;
  search: string;
  onSearchChange: (s: string) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  resultCount: number;
};

const sexOptions: { value: SexFilter; label: string }[] = [
  { value: 'all', label: 'Both' },
  { value: 'M', label: 'Boys' },
  { value: 'F', label: 'Girls' },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'rank-asc', label: 'Rank ↑' },
  { value: 'rank-desc', label: 'Rank ↓' },
  { value: 'trend', label: 'Trend' },
  { value: 'alpha', label: 'A–Z' },
];

const FilterBar = ({
  sex,
  onSexChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <div className="inline-flex rounded-full border border-rule overflow-hidden">
        {sexOptions.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onSexChange(o.value)}
            className={`px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] transition-colors ${
              sex === o.value
                ? 'bg-ink text-paper'
                : 'bg-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 flex-1 min-w-[160px] max-w-md">
        <span className="font-sans uppercase text-[9px] tracking-[0.3em] text-ink-soft">
          search
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="filter…"
          className="flex-1 bg-transparent border-b border-rule font-display italic text-base px-1 py-0.5 outline-none focus:border-ink placeholder:text-ink-soft/50"
        />
      </label>

      <label className="flex items-center gap-2">
        <span className="font-sans uppercase text-[9px] tracking-[0.3em] text-ink-soft">
          sort
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="bg-transparent border-b border-rule font-sans text-[10px] uppercase tracking-[0.18em] py-0.5 pr-1 outline-none focus:border-ink"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <span className="font-sans uppercase text-[10px] tracking-[0.3em] text-ink-soft tabular-nums ml-auto">
        {resultCount.toLocaleString()} {resultCount === 1 ? 'result' : 'results'}
      </span>
    </div>
  );
};

export default FilterBar;
