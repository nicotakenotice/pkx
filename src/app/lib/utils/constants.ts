export const StorageKey = {
  Theme: 'theme',
  Generation: 'generation',
  Favorites: 'favorites'
};

export const Theme = {
  Light: 'light',
  Dark: 'dark',
  Caramellatte: 'caramellatte'
};

export const Generation = {
  Gen1: 1,
  Gen2: 2,
  Gen3: 3,
  Gen4: 4,
  Gen5: 5
} as const;

export type GenerationNumber = (typeof Generation)[keyof typeof Generation];

export const GenerationRange: Record<
  GenerationNumber,
  { offset: number; count: number; label: string }
> = {
  1: { offset: 0, count: 151, label: 'Gen I' },
  2: { offset: 151, count: 100, label: 'Gen II' },
  3: { offset: 251, count: 135, label: 'Gen III' },
  4: { offset: 386, count: 107, label: 'Gen IV' },
  5: { offset: 493, count: 156, label: 'Gen V' }
};
