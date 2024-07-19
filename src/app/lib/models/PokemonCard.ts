import { Pokemon } from 'pokenode-ts';

export interface PokemonCard {
  name: string;
  sprite: string;
  data: Pokemon | null;
}
