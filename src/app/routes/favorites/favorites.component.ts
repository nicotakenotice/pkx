import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonCard } from '@lib/models';
import { HeaderService, PokemonService } from '@lib/services';
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

  displayMode = computed(() => this.pageService.displayMode());
  pokemons = computed(() => this.pokemonService.pokemons().filter((p) => p.isFavorite));
  selectedPokemon = signal<PokemonCard | null>(null);
  modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('modalRef');

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
}
