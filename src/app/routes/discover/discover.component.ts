import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild
} from '@angular/core';
import { PokemonCardComponent, PokemonDetailComponent, SearchBoxComponent } from '@lib/components';
import { HeaderService, PokemonService } from '@lib/services';
import { DiscoverService } from './discover.service';

@Component({
  selector: 'app-discover',
  imports: [PokemonCardComponent, PokemonDetailComponent, SearchBoxComponent],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit, AfterViewInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);
  readonly pageService = inject(DiscoverService);

  pokemons = computed(() => this.pokemonService.pokemons());
  selectedPokemon = computed(() => this.pokemonService.selectedPokemon());
  selectedPokemonSlide = computed(() => this.pageService.selectedPokemonSlide());
  modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('modalRef');

  ngOnInit(): void {
    this.headerService.title.set('Discover');
  }

  ngAfterViewInit(): void {
    this.initSelectedPokemonSlide();
    this.initIntersectionObserver();
  }

  /* ======================================================================= */

  async getPokemonAsync(name: string): Promise<void> {
    this.pokemonService.setSelectedPokemon(name);

    const modal = this.modalRef().nativeElement;
    modal.showModal();

    await this.pokemonService.getPokemonAsync(name);
  }

  initSelectedPokemonSlide(): void {
    const selectedPokemonSlide = this.selectedPokemonSlide();
    if (selectedPokemonSlide) {
      this.scrollToPokemon(selectedPokemonSlide.name, 'instant');
    }
  }

  initIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: document.querySelector('.carousel'),
      threshold: 0.75 // Trigger the callback when the threshold goes above or below the specified number
    };
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          this.pageService.setSelectedPokemonSlide(
            target.dataset['pokemon']!,
            Number(target.dataset['index']!)
          );
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);

    const targets = document.querySelectorAll('[data-pokemon]');
    targets.forEach((t) => observer.observe(t));
  }

  setFavoritePokemon(): void {
    this.pokemonService.setFavoritePokemon();
  }

  scrollToPokemon(name: string, behavior: 'instant' | 'smooth' = 'instant'): void {
    const target = document.querySelector(`[data-pokemon='${name}']`);
    target?.scrollIntoView({ behavior });
  }
}
