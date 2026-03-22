import { Component, inject, input, output } from '@angular/core';
import { PokemonCard } from '@lib/models';
import { PokemonService } from '@lib/services';

@Component({
  selector: 'app-pokemon-card',
  imports: [],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent {
  readonly animations = ['jello', 'wobble', 'bounce', 'rotate-scale-up'];

  private readonly pokemonService = inject(PokemonService);

  pokemon = input.required<PokemonCard>();
  onDetailsClick = output<string>();

  startAnimation(e: Event): void {
    const randomAnimation = this.animations[Math.floor(Math.random() * this.animations.length)];
    const target = e.target as HTMLImageElement;
    target.classList.add(randomAnimation);

    setTimeout(() => {
      target.classList.remove(randomAnimation);
    }, 1000);
  }

  toggleFavorite(name: string): void {
    this.pokemonService.toggleFavoritePokemon(name);
  }

  playCry(name: string): void {
    this.pokemonService.playCry(name);
  }
}
