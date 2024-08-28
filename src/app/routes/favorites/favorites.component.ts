import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonCard } from '@lib/models';
import {
  CoolThingsService,
  FIREWORKS_DURATION,
  HeaderService,
  PokemonService
} from '@lib/services';
import { DisplayMode, FavoritesService } from './favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);
  readonly pageService = inject(FavoritesService);
  readonly coolThingsService = inject(CoolThingsService);

  displayMode = computed(() => this.pageService.displayMode());
  pokemons = computed(() => this.pokemonService.pokemons().filter((p) => p.isFavorite));
  selectedPokemon = signal<PokemonCard | null>(null);
  modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('modalRef');
  fireworksPlaying = signal<boolean>(false);
  notificationError = signal<any>(null);

  ngOnInit(): void {
    this.headerService.title.set('Favorites');
  }

  setDisplayMode(mode: DisplayMode): void {
    if (mode === this.displayMode()) {
      return;
    }
    this.pageService.setDisplayMode(mode);
  }

  showActions(pokemon: PokemonCard): void {
    this.selectedPokemon.set(pokemon);

    const modal = this.modalRef().nativeElement;
    modal.showModal();
  }

  hugPokemon(pokemon: PokemonCard): void {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        this.sendHugNotification(pokemon);
        this.fireworks();
      }
    });
  }

  sendHugNotification(pokemon: PokemonCard): void {
    const pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const title = `${pokemonName} hugs you back!`;
    const body = `${pokemonName} happiness increased.`;

    try {
      if (!('Notification' in window)) {
        this.notificationError.set('This browser does NOT support notifications.');
      } else {
        new Notification(title, { icon: pokemon.sprite, body: body });
        // const notification = new Notification(title, { icon: pokemon.sprite, body: body });
        // this.notificationError.set(`Notification "${notification.title}" should be displayed.`);
      }
    } catch (err: any) {
      this.notificationError.set(Date.now() + ' --> ' + err);
    }
  }

  fireworks(): void {
    const container = document.querySelector('.fireworks')!;
    const options = {
      gravity: 1.4,
      opacity: 0.4,
      autoresize: true,
      acceleration: 1.0
    };
    this.coolThingsService.fireworks(container, options);

    this.fireworksPlaying.set(true);
    setTimeout(() => {
      this.fireworksPlaying.set(false);
    }, FIREWORKS_DURATION);
  }

  removePokemon(pokemon: PokemonCard): void {
    const pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const message = `${pokemonName} warns you!`;
    this.notificationError.set(message);
  }

  dismissNotificationError(): void {
    this.notificationError.set(null);
  }
}
