import { Component, input, output } from '@angular/core';
import { PokemonCard } from '@lib/models';

@Component({
  selector: 'app-pokemon-detail',
  imports: [],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent {
  pokemon = input.required<PokemonCard | null>();
  onFavoriteClick = output<void>();
}
