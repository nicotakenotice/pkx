import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { PokemonCard } from '@lib/models';

declare var ColorThief: any;

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements AfterViewInit {
  readonly animations = ['jello', 'wobble', 'bounce', 'rotate-scale-up'];

  pokemon = input.required<PokemonCard>();
  onDetailsClick = output<string>();

  imgRef = viewChild<ElementRef<HTMLImageElement>>('imgRef');
  imgMainColor = signal<string>('transparent');

  ngAfterViewInit(): void {
    const colorThief = new ColorThief();

    setTimeout(async () => {
      const img = this.imgRef()?.nativeElement;
      if (img && img.complete) {
        const [r, g, b] = await colorThief.getColor(img);
        this.imgMainColor.set(`rgb(${r}, ${g}, ${b})`);
      }
    }, 1000);
  }

  startAnimation(e: Event): void {
    const randomAnimationClass =
      this.animations[Math.floor(Math.random() * this.animations.length)];
    const target = e.target as HTMLImageElement;
    target.classList.add(randomAnimationClass);

    setTimeout(() => {
      target.classList.remove(randomAnimationClass);
    }, 1000);
  }
}
