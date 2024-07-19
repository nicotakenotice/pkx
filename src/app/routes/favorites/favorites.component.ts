import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { HeaderService, PokemonService } from '@lib/services';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);

  pokemons = computed(() => this.pokemonService.pokemons());

  ngOnInit(): void {
    this.headerService.title.set('Favorites');
  }
}
