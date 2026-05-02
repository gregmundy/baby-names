import type { CSSProperties } from 'react';

type NameTagProps = {
  name: string;
  index: number;
  rotation?: number;
  onUnpin?: () => void;
};

const NameTag = ({ name, index, rotation = 0, onUnpin }: NameTagProps) => {
  const orderLabel = String(index + 1).padStart(2, '0');

  const outerStyle: CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  const fadeStyle = { '--delay': `${index * 100 + 180}ms` } as CSSProperties;

  return (
    <div
      className="group relative will-change-transform transition-transform duration-500 hover:[transform:rotate(0deg)_translateY(-10px)_scale(1.02)]"
      style={outerStyle}
    >
      <div
        className="tag-fade-in relative h-[300px] w-[420px] bg-paper p-3 rounded-[10px] border border-rule shadow-[0_22px_36px_-14px_rgba(60,30,10,0.45),0_4px_10px_-4px_rgba(60,30,10,0.28)] transition-shadow duration-500 group-hover:shadow-[0_36px_60px_-18px_rgba(60,30,10,0.55),0_8px_16px_-6px_rgba(60,30,10,0.35)]"
        style={fadeStyle}
      >
        <div
          aria-hidden
          className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2 w-32 h-7 bg-tape/70 shadow-sm pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 6px)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        />

        <div className="absolute -left-4 -top-4 z-10 w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center shadow-lg ring-1 ring-ink/40">
          <span className="font-display italic text-[15px] tracking-tight leading-none mt-px">
            {orderLabel}
          </span>
        </div>

        {onUnpin && (
          <button
            type="button"
            onClick={onUnpin}
            aria-label={`Remove ${name} from shortlist`}
            className="absolute -right-3 -top-3 z-10 h-8 w-8 rounded-full bg-paper border border-ink/30 text-ink shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-cinnabar hover:text-paper hover:border-cinnabar focus:opacity-100"
          >
            <span className="block leading-none -mt-0.5 text-lg">×</span>
          </button>
        )}

        <div className="flex flex-col w-full h-full overflow-hidden rounded-[6px]">
          <div className="flex flex-[2] flex-col w-full px-4 pt-5 pb-3 bg-cinnabar text-paper text-center relative">
            <h1 className="font-sans font-black text-[40px] leading-none tracking-[16px] uppercase pl-4">
              Hello
            </h1>
            <h2 className="font-sans font-bold text-[18px] tracking-[5px] lowercase mt-2">
              my name is
            </h2>
            <span
              aria-hidden
              className="absolute inset-x-3 bottom-0 h-px bg-cinnabar-deep/50"
            />
          </div>
          <div className="relative flex flex-[4] flex-col items-center justify-center bg-paper-deep/60 text-center">
            <p className="font-marker text-[72px] leading-none tracking-[2px] text-ink select-none">
              {name}
            </p>
          </div>
          <div className="flex-1 bg-cinnabar relative">
            <span
              aria-hidden
              className="absolute inset-x-3 top-0 h-px bg-cinnabar-deep/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameTag;
