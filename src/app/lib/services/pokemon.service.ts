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
  favoritePokemons = signal<PokemonCard[]>(this._loadFavoritePokemons());

  constructor() {
    effect(() => {
      const entries: FavoriteEntry[] = this.favoritePokemons().map((p) => ({
        id: p.id,
        name: p.name
      }));
      localStorage.setItem(StorageKey.Favorites, JSON.stringify(entries));
    });

    this.loadGeneration(this.currentGeneration());
  }

  /* ======================================================================= */

  private _loadGeneration(): GenerationNumber {
    const stored = localStorage.getItem(StorageKey.Generation);
    const parsed = stored ? parseInt(stored, 10) : Generation.Gen1;
    return (
      (Object.values(Generation) as number[]).includes(parsed) ? parsed : Generation.Gen1
    ) as GenerationNumber;
  }

  async loadGeneration(gen: GenerationNumber): Promise<void> {
    this.isLoading.set(true);
    this.currentGeneration.set(gen);
    localStorage.setItem(StorageKey.Generation, String(gen));

    try {
      const { offset, count } = GenerationRange[gen];
      const response = await this._apiClient.listPokemons(offset, count);
      const favoriteNames = new Set(this.favoritePokemons().map((p) => p.name));

      const pokemons = await Promise.all(
        response.results.map((pokemon) => this._apiClient.getPokemonByName(pokemon.name))
      );

      this.pokemons.set(
        pokemons.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          sprite: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/${pokemon.id}.gif`,
          isFavorite: favoriteNames.has(pokemon.name),
          cry: (pokemon as any).cries?.latest ?? null,
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
    const current = this.favoritePokemons();
    if (current.length === 0) return [];

    const toFetch = current.filter((p) => !p.data);

    if (toFetch.length === 0) {
      return [...current].sort((a, b) => a.id - b.id);
    }

    const fetched = await Promise.all(
      toFetch.map((entry) => this._apiClient.getPokemonByName(entry.name))
    );

    const fetchedCards: PokemonCard[] = fetched.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      sprite: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/${pokemon.id}.gif`,
      isFavorite: true,
      cry: (pokemon as any).cries?.latest ?? null,
      data: pokemon
    }));

    // Update favoritePokemons with fetched data in-place
    this.favoritePokemons.update((favs) =>
      favs.map((p) => {
        const found = fetchedCards.find((f) => f.name === p.name);
        return found ?? p;
      })
    );

    return this.favoritePokemons().sort((a, b) => a.id - b.id);
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

  private _loadFavoritePokemons(): PokemonCard[] {
    return this._readFavoriteEntries().map((entry) => ({
      id: entry.id,
      name: entry.name,
      sprite: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/showdown/${entry.id}.gif`,
      isFavorite: true,
      data: null,
      cry: null
    }));
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
        const data = await this._apiClient.getPokemonByName(name);
        const updated: PokemonCard = {
          ...pokemon,
          data,
          cry: pokemon.cry ?? (data as any).cries?.latest ?? null
        };
        this.pokemons.update((pokemons) => pokemons.map((p) => (p.name === name ? updated : p)));
        this.selectedPokemon.set(updated);
      }
    } catch (err) {
      console.error(err);
    }
  }

  toggleFavoritePokemon(name: string): void {
    // Update isFavorite flag in pokemons for Discover UI sync
    this.pokemons.update((pokemons) =>
      pokemons.map((p) => (p.name === name ? { ...p, isFavorite: !p.isFavorite } : p))
    );

    // Update selectedPokemon if it matches
    if (this.selectedPokemon()?.name === name) {
      this.selectedPokemon.update((p) => (p ? { ...p, isFavorite: !p.isFavorite } : p));
    }

    // Update favoritePokemons (source of truth) — single lookup
    const card = this.pokemons().find((p) => p.name === name);
    if (card?.isFavorite) {
      this.favoritePokemons.update((favs) => [...favs, card].sort((a, b) => a.id - b.id));
    } else {
      this.favoritePokemons.update((favs) => favs.filter((p) => p.name !== name));
    }
  }

  removeFavoritePokemon(name: string): void {
    this.pokemons.update((pokemons) =>
      pokemons.map((p) => (p.name === name ? { ...p, isFavorite: false } : p))
    );
    this.favoritePokemons.update((favs) => favs.filter((p) => p.name !== name));
  }

  clearFavorites(): void {
    this.pokemons.update((pokemons) => pokemons.map((p) => ({ ...p, isFavorite: false })));
    this.favoritePokemons.set([]);
  }

  playCry(name: string): void {
    const pokemon = this.pokemons().find((p) => p.name === name);
    if (pokemon?.cry) {
      new Audio(pokemon.cry).play().catch((err) => console.warn('Audio play failed:', err));
    }
  }
}
