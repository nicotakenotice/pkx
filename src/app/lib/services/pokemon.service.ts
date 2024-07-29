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

  setSelectedPokemon(name: string): void {
    const pokemon = this.pokemons().find((p) => p.name === name);
    this.selectedPokemon.set(pokemon ?? null);
  }

  async getPokemonAsync(name: string): Promise<void> {
    const pokemon = this.selectedPokemon();
    if (!pokemon) return;

    try {
      if (!pokemon.data) {
        pokemon.data = await this._apiClient.getPokemonByName(name);
        this.pokemons.update((pokemons) => pokemons.map((p) => (p.name === name ? pokemon : p)));
      }
      this.selectedPokemon.set(pokemon);
    } catch (err) {
      console.error(err);
    }
  }
}
