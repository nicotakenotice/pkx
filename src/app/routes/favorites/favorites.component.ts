import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderService, PokemonService } from '@lib/services';
import { FavoritesService } from './favorites.service';

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

  ngOnInit(): void {
    this.headerService.title.set('Favorites');
  }

  toggleDisplayMode(): void {
    const currentMode = this.displayMode();
    this.pageService.setDisplayMode(currentMode === 'list' ? 'grid' : 'list');
  }
}
