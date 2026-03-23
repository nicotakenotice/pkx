export const PokemonTypeColor: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

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
