import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Pokemon } from '@lib/models';
import { HeaderService } from '@lib/services';
import { pokemonNames } from '@lib/utils';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  readonly headerService = inject(HeaderService);

  pokemons = signal<Pokemon[]>([]);

  ngOnInit(): void {
    this.headerService.title.set('Favorites');

    this.getPokemons();
  }

  getPokemons(): void {
    this.pokemons.set(
      pokemonNames.map((name) => ({
        name,
        sprite: `sprites-animated/${name}.gif`
      }))
    );
  }
}
