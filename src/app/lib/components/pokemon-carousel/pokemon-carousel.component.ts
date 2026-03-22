import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild
} from '@angular/core';
import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonCard } from '@lib/models';
import { PokemonService } from '@lib/services';

@Component({
  selector: 'app-pokemon-carousel',
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-carousel.component.html',
  styleUrl: './pokemon-carousel.component.css'
})
export class PokemonCarouselComponent implements AfterViewInit, OnDestroy {
  private readonly pokemonService = inject(PokemonService);

  pokemons = input.required<PokemonCard[]>();
  onSlideChange = output<{ name: string; index: number }>();
  onDetailsClick = output<string>();

  private emblaViewport = viewChild.required<ElementRef<HTMLElement>>('emblaViewport');
  private embla: EmblaCarouselType | null = null;

  readonly currentIndex = signal(0);

  constructor() {
    effect(() => {
      this.pokemonService.currentGeneration(); // reset solo al cambio di generazione
      if (this.embla) {
        this.embla.reInit();
        this.embla.scrollTo(0, true);
        this.currentIndex.set(0);
        this.onSlideChange.emit({ name: this.pokemons()[0]?.name ?? '', index: 0 });
      }
    });
  }

  ngAfterViewInit(): void {
    this.embla = EmblaCarousel(this.emblaViewport().nativeElement, { loop: false });
    this.embla.on('select', () => this.onSelect());
  }

  ngOnDestroy(): void {
    this.embla?.destroy();
  }

  prev(): void {
    this.embla?.scrollPrev();
  }

  next(): void {
    this.embla?.scrollNext();
  }

  scrollTo(name: string, jump = false): void {
    const index = this.pokemons().findIndex((p) => p.name === name);
    if (index !== -1) {
      this.embla?.scrollTo(index, jump);
    }
  }

  private onSelect(): void {
    const index = this.embla?.selectedScrollSnap() ?? 0;
    const name = this.pokemons()[index]?.name ?? '';
    this.currentIndex.set(index);
    this.onSlideChange.emit({ name, index });
  }
}
