import type { CuratedList } from '../types';
import { labelForCurated } from '../lib/features';

type Props = {
  value: CuratedList;
  onChange: (v: CuratedList) => void;
  counts?: Partial<Record<CuratedList, number>>;
};

const order: CuratedList[] = [
  'all',
  'rare-not-odd',
  'vintage-revival',
  'sweet-spot-rising',
  'just-emerging',
  'long-arc-classic',
  'goldilocks',
];

const CuratedTabs = ({ value, onChange, counts }: Props) => {
  return (
    <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-2 -mx-1">
      {order.map((key) => {
        const active = value === key;
        const count = counts?.[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative px-1 pb-1 font-display text-[15px] leading-tight transition-colors ${
              active
                ? 'text-ink italic'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {labelForCurated[key]}
            {typeof count === 'number' && (
              <span
                className={`ml-1.5 align-baseline font-sans not-italic uppercase text-[9px] tracking-[0.16em] tabular-nums ${
                  active ? 'text-cinnabar' : 'text-ink-soft/70'
                }`}
              >
                {count.toLocaleString()}
              </span>
            )}
            {active && (
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 right-0 h-px bg-cinnabar"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default CuratedTabs;
