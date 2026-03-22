import { effect, Injectable, signal } from '@angular/core';
import { FavoriteEntry, PokemonCard } from '@lib/models';
import { Generation, GenerationNumber, GenerationRange, StorageKey } from '@lib/utils';
import { PokemonClient } from 'pokenode-ts';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private _apiClient = new PokemonClient();

  currentGeneration = signal<GenerationNumber>(this._loadGeneration());
  pokemons = signal<PokemonCard[]>([]);
  selectedPokemon = signal<PokemonCard | null>(null);
  isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const favorites: FavoriteEntry[] = this.pokemons()
        .filter((p) => p.isFavorite)
        .map((p) => ({ id: p.id, name: p.name }));

      const stored = this._readFavoriteEntries();
      const inMemoryNames = new Set(this.pokemons().map((p) => p.name));
      const otherGenFavorites = stored.filter((e) => !inMemoryNames.has(e.name));
      const merged = [...favorites, ...otherGenFavorites];

      localStorage.setItem(StorageKey.Favorites, JSON.stringify(merged));
    });

    this.loadGeneration(this.currentGeneration());
  }

  /* ======================================================================= */

  private _loadGeneration(): GenerationNumber {
    const stored = localStorage.getItem(StorageKey.Generation);
    const parsed = stored ? parseInt(stored, 10) : 1;
    return (
      (Object.values(Generation) as number[]).includes(parsed) ? parsed : 1
    ) as GenerationNumber;
  }

  async loadGeneration(gen: GenerationNumber): Promise<void> {
    this.isLoading.set(true);
    this.currentGeneration.set(gen);
    localStorage.setItem(StorageKey.Generation, String(gen));

    try {
      const { offset, count } = GenerationRange[gen];
      const response = await this._apiClient.listPokemons(offset, count);
      const favoriteNames = new Set(this._readFavoriteEntries().map((e) => e.name));

      const pokemons = await Promise.all(
        response.results.map((pokemon) => this._apiClient.getPokemonByName(pokemon.name))
      );

      this.pokemons.set(
        pokemons.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          sprite: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/${pokemon.id}.gif`,
          isFavorite: favoriteNames.has(pokemon.name),
          data: pokemon
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadFavoritePokemons(): Promise<PokemonCard[]> {
    const entries = this._readFavoriteEntries();
    if (entries.length === 0) return [];

    const inMemory = new Map(this.pokemons().map((p) => [p.name, p]));
    const result: PokemonCard[] = [];
    const toFetch: FavoriteEntry[] = [];

    for (const entry of entries) {
      const cached = inMemory.get(entry.name);
      if (cached && cached.isFavorite) {
        result.push(cached);
      } else {
        toFetch.push(entry);
      }
    }

    if (toFetch.length > 0) {
      const fetched = await Promise.all(
        toFetch.map((entry) => this._apiClient.getPokemonByName(entry.name))
      );
      for (const pokemon of fetched) {
        result.push({
          id: pokemon.id,
          name: pokemon.name,
          sprite: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/${pokemon.id}.gif`,
          isFavorite: true,
          data: pokemon
        });
      }
    }

    return result.sort((a, b) => a.id - b.id);
  }

  private _readFavoriteEntries(): FavoriteEntry[] {
    const raw = localStorage.getItem(StorageKey.Favorites);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as FavoriteEntry[];
    } catch {
      return [];
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

  setFavoritePokemon(): void {
    this.selectedPokemon.update((p) => (p ? { ...p, isFavorite: !p.isFavorite } : p));
    this.pokemons.update((pokemons) =>
      pokemons.map((p) => (p.name === this.selectedPokemon()!.name ? this.selectedPokemon()! : p))
    );
  }

  removeFavoritePokemon(name: string): void {
    this.pokemons.update((pokemons) =>
      pokemons.map((p) => (p.name === name ? { ...p, isFavorite: false } : p))
    );
    const entries = this._readFavoriteEntries().filter((e) => e.name !== name);
    localStorage.setItem(StorageKey.Favorites, JSON.stringify(entries));
  }

  clearFavorites(): void {
    this.pokemons.update((pokemons) => pokemons.map((p) => ({ ...p, isFavorite: false })));
    localStorage.setItem(StorageKey.Favorites, JSON.stringify([]));
  }
}
