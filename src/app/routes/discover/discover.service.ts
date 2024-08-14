import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DiscoverService {
  selectedPokemonSlide = signal<{ name: string; index: number }>({ name: '', index: 0 });

  setSelectedPokemonSlide(name: string, index: number): void {
    this.selectedPokemonSlide.set({ name, index });
  }
}
