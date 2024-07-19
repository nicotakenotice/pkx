import { Injectable, signal } from '@angular/core';
import { PokemonCard } from '@lib/models';
import { POKEMON_NAMES } from '@lib/utils';
import { PokemonClient } from 'pokenode-ts';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private _apiClient = new PokemonClient();

  pokemons = signal<PokemonCard[]>([]);
  selectedPokemon = signal<PokemonCard | null>(null);

  constructor() {
    this.getPokemons();
  }

  /* ======================================================================= */

  getPokemons(): void {
    this.pokemons.set(
      POKEMON_NAMES.map((name) => ({
        name,
        sprite: `sprites-animated/${name}.gif`,
        data: null
      }))
    );
  }

  async getPokemonsAsync(): Promise<void> {
    try {
      const pokemons = await this._apiClient.listPokemons(0, 151);
      console.log(pokemons);
    } catch (err) {
      console.error(err);
    }
  }

  async getPokemonAsync(name: string, index: number): Promise<void> {
    try {
      const pokemon = this.pokemons()[index];
      if (!pokemon.data) {
        pokemon.data = await this._apiClient.getPokemonByName(name);
        this.pokemons.update((pokemons) => pokemons.map((p) => (p.name === name ? pokemon : p)));
      }
      this.selectedPokemon.set(pokemon);
    } catch (err) {
      console.error(err);
      this.selectedPokemon.set(null);
    }
  }
}
