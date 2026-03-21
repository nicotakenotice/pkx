import { Component, input, output } from '@angular/core';
import { PokemonCard } from '@lib/models';

@Component({
  selector: 'app-pokemon-card',
  imports: [],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent {
  readonly animations = ['jello', 'wobble', 'bounce', 'rotate-scale-up'];

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
}
