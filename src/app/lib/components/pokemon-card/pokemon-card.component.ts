import { Component, computed, inject, input, output } from '@angular/core';
import { PokemonCard } from '@lib/models';
import { PokemonService } from '@lib/services';
import { getTypeGradient } from '@lib/utils';

@Component({
  selector: 'app-pokemon-card',
  imports: [],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent {
  readonly animations = ['jello', 'wobble', 'bounce'];

  private readonly pokemonService = inject(PokemonService);

  pokemon = input.required<PokemonCard>();
  onDetailsClick = output<string>();

  readonly typeGradient = computed(() => getTypeGradient(this.pokemon().data?.types[0]?.type.name));

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
