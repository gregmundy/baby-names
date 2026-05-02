import { useEffect } from 'react';
import type { ShortlistEntry } from '../types';
import { rotationFor } from '../lib/heuristics';
import NameTag from './NameTag';

type Props = {
  open: boolean;
  onClose: () => void;
  list: ShortlistEntry[];
  onRemove: (entry: ShortlistEntry) => void;
};

const CorkboardModal = ({ open, onClose, list, onRemove }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shortlist corkboard"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-8 sm:py-12"
    >
      <button
        type="button"
        aria-label="Close corkboard"
        onClick={onClose}
        className="backdrop-fade absolute inset-0 bg-ink/45 backdrop-blur-sm cursor-default"
      />
      <div className="modal-rise relative paper-grain bg-paper rounded-lg shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] w-[94vw] max-w-5xl px-6 sm:px-12 py-8 sm:py-10">
        <header className="flex items-baseline justify-between mb-8 pb-4 border-b border-rule">
          <div>
            <p className="font-sans uppercase tracking-[0.4em] text-[10px] text-ink-soft">
              the shortlist
            </p>
            <h2 className="mt-2 font-display italic text-3xl sm:text-4xl text-ink">
              Corkboard
              <span className="text-cinnabar">.</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-sans uppercase text-[11px] tracking-[0.3em] text-ink-soft hover:text-ink transition-colors"
          >
            close ✕
          </button>
        </header>

        {list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display italic text-lg text-ink-soft">
              No pinned names. Close this and pin a few from the catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 place-items-center pt-6 pb-4">
            {list.map((entry, i) => (
              <NameTag
                key={`${entry.sex}:${entry.name}`}
                name={entry.name}
                index={i}
                rotation={rotationFor(entry.name)}
                onUnpin={() => onRemove(entry)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorkboardModal;
