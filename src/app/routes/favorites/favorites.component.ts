import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonCard } from '@lib/models';
import { CoolThingsService, FireworksDuration, HeaderService, PokemonService } from '@lib/services';
import { DisplayMode, FavoritesService } from './favorites.service';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, DecimalPipe, NgTemplateOutlet],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);
  readonly pageService = inject(FavoritesService);
  readonly coolThingsService = inject(CoolThingsService);

  displayMode = this.pageService.displayMode;
  favoritePokemons = this.pokemonService.favoritePokemons; // direct reactive signal
  isLoadingFavorites = signal<boolean>(false);
  selectedPokemon = signal<PokemonCard | null>(null);
  modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('modalRef');
  fireworksPlaying = signal<boolean>(false);
  feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  ngOnInit(): void {
    this.headerService.title.set('Favorites');
    this._ensureFavoritesLoaded();
  }

  // Fetch full data for favorites that were loaded from localStorage at startup (data: null)
  private async _ensureFavoritesLoaded(): Promise<void> {
    if (this.favoritePokemons().some((p) => !p.data)) {
      this.isLoadingFavorites.set(true);
      try {
        await this.pokemonService.loadFavoritePokemons();
      } finally {
        this.isLoadingFavorites.set(false);
      }
    }
  }

  setDisplayMode(mode: DisplayMode): void {
    if (mode === this.displayMode()) return;
    this.pageService.setDisplayMode(mode);
  }

  showActions(pokemon: PokemonCard): void {
    this.selectedPokemon.set(pokemon);
    this.modalRef().nativeElement.showModal();
  }

  hugPokemon(pokemon: PokemonCard): void {
    this.sendHugNotification(pokemon);
    this.fireworks();
  }

  sendHugNotification(pokemon: PokemonCard): void {
    const pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const title = `${pokemonName} hugs you back!`;
    const body = `${pokemonName} happiness increased.`;

    this.feedback.set({ type: 'success', message: body });

    if (!('Notification' in window)) {
      this.feedback.set({ type: 'error', message: 'This browser does NOT support notifications.' });
    } else {
      try {
        Notification.requestPermission().then((result) => {
          if (result === 'granted') {
            new Notification(title, { icon: pokemon.sprite, body });
          }
        });
      } catch (err: any) {
        this.feedback.set({ type: 'error', message: Date.now() + ' --> ' + err });
      }
    }
  }

  fireworks(): void {
    const container = document.querySelector('.fireworks')!;
    this.coolThingsService.startFireworks(container);
    this.fireworksPlaying.set(true);
    setTimeout(() => this.fireworksPlaying.set(false), FireworksDuration);
  }

  removePokemon(pokemon: PokemonCard): void {
    this.pokemonService.removeFavoritePokemon(pokemon.name);
    this.feedback.set(null);
    this.modalRef().nativeElement.close();
  }

  clearFavorites(): void {
    this.pokemonService.clearFavorites();
  }

  dismissFeedback(): void {
    this.feedback.set(null);
  }
}
