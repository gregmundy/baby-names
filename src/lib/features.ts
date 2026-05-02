export const countSyllables = (raw: string): number => {
  const s = raw.toLowerCase().replace(/[^a-z]/g, '');
  if (!s) return 1;
  const groups = s.match(/[aeiouy]+/g);
  let count = groups?.length ?? 1;
  if (s.endsWith('e') && count > 1) count--;
  return Math.max(1, count);
};

export const featuresFor = (name: string) => {
  const lower = name.toLowerCase();
  return {
    syllables: countSyllables(name),
    startsWith: lower[0] ?? '',
    endsWith: lower[lower.length - 1] ?? '',
    length: name.length,
  };
};

export const labelForTag: Record<string, string> = {
  'rare-not-odd': 'rare, not odd',
  'vintage-revival': 'vintage revival',
  'sweet-spot-rising': 'sweet-spot rising',
  'just-emerging': 'just emerging',
  'long-arc-classic': 'long-arc classic',
  goldilocks: 'goldilocks',
};

export const labelForCurated: Record<string, string> = {
  all: 'All',
  'rare-not-odd': 'Rare, not odd',
  'vintage-revival': 'Vintage revival',
  'sweet-spot-rising': 'Sweet-spot rising',
  'just-emerging': 'Just emerging',
  'long-arc-classic': 'Long-arc classic',
  goldilocks: 'Goldilocks',
  'sibling-fit': 'Sibling fit',
};
