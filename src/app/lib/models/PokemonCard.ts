import { Pokemon } from 'pokenode-ts';

export interface PokemonCard {
  id: number;
  name: string;
  sprite: string;
  isFavorite: boolean;
  data: Pokemon | null;
}
