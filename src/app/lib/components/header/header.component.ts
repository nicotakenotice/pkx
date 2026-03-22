import { Component, computed, inject } from '@angular/core';
import { HeaderService, PokemonService } from '@lib/services';
import { Generation, GenerationNumber, GenerationRange } from '@lib/utils';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);

  readonly generationOptions = Object.values(Generation).map((gen) => ({
    value: gen,
    label: GenerationRange[gen].label
  }));

  readonly title = computed(() => this.headerService.title());
  readonly currentGeneration = computed(() => this.pokemonService.currentGeneration());
  readonly isLoading = computed(() => this.pokemonService.isLoading());

  setGeneration(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10) as GenerationNumber;
    this.pokemonService.loadGeneration(value);
  }
}
