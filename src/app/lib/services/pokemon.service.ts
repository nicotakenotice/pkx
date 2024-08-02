import { effect, Injectable, signal } from '@angular/core';
import { PokemonCard } from '@lib/models';
import { POKEMON_NAMES, STORAGE_KEY } from '@lib/utils';
import { PokemonClient } from 'pokenode-ts';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private _apiClient = new PokemonClient();

  pokemons = signal<PokemonCard[]>([]);
  selectedPokemon = signal<PokemonCard | null>(null);
  selectedPokemonSlide = signal<{ name: string, index: number }>({ name: '', index: 0 });

  constructor() {
    effect(() => {
      const favorites = this.pokemons()
        .filter((p) => p.isFavorite)
        .map((p) => p.name);
      localStorage.setItem(STORAGE_KEY.FAVORITES, JSON.stringify(favorites));
    });

    this.getPokemons();
  }

  /* ======================================================================= */

  getPokemons(): void {
    const favorites = this.getFavoritePokemonNames();

    this.pokemons.set(
      POKEMON_NAMES.map((name) => ({
        name,
        sprite: `sprites-animated/${name}.gif`,
        isFavorite: favorites.includes(name),
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

  getFavoritePokemonNames(): string[] {
    const favoritesString = localStorage.getItem(STORAGE_KEY.FAVORITES);
    if (!favoritesString) {
      localStorage.setItem(STORAGE_KEY.FAVORITES, JSON.stringify([]));
      return [];
    }
    const favorites = JSON.parse(favoritesString) as string[];
    return favorites;
  }

  setSelectedPokemon(name: string): void {
    const pokemon = this.pokemons().find((p) => p.name === name);
    this.selectedPokemon.set(pokemon ?? null);
  }

  setSelectedPokemonSlide(name: string, index: number): void {
    this.selectedPokemonSlide.set({ name, index });
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

  setFavoritePokemon(): void {
    this.selectedPokemon.update((p) => (p ? { ...p, isFavorite: !p.isFavorite } : p));
    this.pokemons.update((pokemons) =>
      pokemons.map((p) => (p.name === this.selectedPokemon()!.name ? this.selectedPokemon()! : p))
    );
  }
}
