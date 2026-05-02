import { useCallback, useEffect, useState } from 'react';
import type { ShortlistEntry } from '../types';

const STORAGE_KEY = 'baby-names:shortlist:v1';

const defaultShortlist: ShortlistEntry[] = [
  { name: 'Gregory', sex: 'M' },
  { name: 'Meghann', sex: 'F' },
  { name: 'Anna', sex: 'F' },
  { name: 'Cora', sex: 'F' },
];

const sameEntry = (a: ShortlistEntry, b: ShortlistEntry) =>
  a.name === b.name && a.sex === b.sex;

export const useShortlist = () => {
  const [list, setList] = useState<ShortlistEntry[]>(() => {
    if (typeof window === 'undefined') return defaultShortlist;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ShortlistEntry[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* fall through */
    }
    return defaultShortlist;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore quota / privacy errors */
    }
  }, [list]);

  const isFavorite = useCallback(
    (entry: ShortlistEntry) => list.some((e) => sameEntry(e, entry)),
    [list]
  );

  const toggleFavorite = useCallback((entry: ShortlistEntry) => {
    setList((curr) =>
      curr.some((e) => sameEntry(e, entry))
        ? curr.filter((e) => !sameEntry(e, entry))
        : [...curr, entry]
    );
  }, []);

  const remove = useCallback((entry: ShortlistEntry) => {
    setList((curr) => curr.filter((e) => !sameEntry(e, entry)));
  }, []);

  const reset = useCallback(() => setList(defaultShortlist), []);

  return { list, isFavorite, toggleFavorite, remove, reset };
};
