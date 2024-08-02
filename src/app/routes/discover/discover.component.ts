import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild
} from '@angular/core';
import { HeaderService, PokemonService } from '@lib/services';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit, AfterViewInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);

  pokemons = computed(() => this.pokemonService.pokemons());
  selectedPokemon = computed(() => this.pokemonService.selectedPokemon());
  selectedPokemonSlide = computed(() => this.pokemonService.selectedPokemonSlide());
  modalRef = viewChild.required<ElementRef>('modalRef');

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

    const modal = this.modalRef().nativeElement as HTMLDialogElement;
    modal.showModal();

    await this.pokemonService.getPokemonAsync(name);
  }

  initSelectedPokemonSlide(): void {
    const selectedPokemonSlide = this.selectedPokemonSlide();
    if (selectedPokemonSlide) {
      const target = document.querySelector(`[data-pokemon='${selectedPokemonSlide}']`);
      target?.scrollIntoView({ behavior: 'instant' });
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
          this.pokemonService.setSelectedPokemonSlide(target.dataset['pokemon']!);
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
}