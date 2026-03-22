import { DecimalPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { PokemonCard } from '@lib/models';
import { PokemonService } from '@lib/services';

@Component({
  selector: 'app-pokemon-detail',
  imports: [DecimalPipe],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent {
  private readonly pokemonService = inject(PokemonService);

  pokemon = input.required<PokemonCard | null>();
  onFavoriteClick = output<void>();

  playCry(): void {
    const name = this.pokemon()?.name;
    if (name) this.pokemonService.playCry(name);
  }
}
