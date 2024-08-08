import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PokemonCard } from '@lib/models';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent {
  readonly animations = ['jello', 'wobble', 'bounce', 'rotate-scale-up'];

  pokemon = input.required<PokemonCard>();
  onDetailsClick = output<string>();

  startAnimation(e: Event): void {
    const randomAnimationClass = this.animations[Math.floor(Math.random() * this.animations.length)];
    const target = e.target as HTMLImageElement;
    target.classList.add(randomAnimationClass);

    setTimeout(() => {
      target.classList.remove(randomAnimationClass)
    }, 1000);
  }
}
