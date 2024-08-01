import { Pokemon } from 'pokenode-ts';

export interface PokemonCard {
  name: string;
  sprite: string;
  isFavorite: boolean;
  data: Pokemon | null;
}
