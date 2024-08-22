import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { PokemonCard } from '@lib/models';
import { ColorThiefService } from '@lib/services';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements AfterViewInit {
  readonly colorThiefService = inject(ColorThiefService);
  readonly animations = ['jello', 'wobble', 'bounce', 'rotate-scale-up'];

  pokemon = input.required<PokemonCard>();
  onDetailsClick = output<string>();

  divGradientRef = viewChild<ElementRef<HTMLDivElement>>('divGradientRef');
  imgRef = viewChild<ElementRef<HTMLImageElement>>('imgRef');
  imgMainColor = signal<string>('transparent');

  ngAfterViewInit(): void {
    const colorThief = this.colorThiefService.colorThief;
    const divGradient = this.divGradientRef()?.nativeElement;
    const img = this.imgRef()?.nativeElement;

    setTimeout(async () => {
      if (img && img.complete) {
        const [r, g, b] = await colorThief.getColor(img);
        this.imgMainColor.set(`rgb(${r}, ${g}, ${b})`);
        divGradient?.classList.add('fade-in');
      } else {
        console.log(`${this.pokemon().name} image not loaded yet`);
      }
    }, 200);
  }

  startAnimation(e: Event): void {
    const randomAnimation = this.animations[Math.floor(Math.random() * this.animations.length)];
    const target = e.target as HTMLImageElement;
    target.classList.add(randomAnimation);

    setTimeout(() => {
      target.classList.remove(randomAnimation);
    }, 1000);
  }
}
