import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
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
export class DiscoverComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);

  pokemons = computed(() => this.pokemonService.pokemons());
  selectedPokemon = computed(() => this.pokemonService.selectedPokemon());
  isLoading = signal<boolean>(false);
  modalRef = viewChild.required<ElementRef>('modalRef');

  ngOnInit(): void {
    this.headerService.title.set('Discover');
  }

  /* ======================================================================= */

  async getPokemonAsync(name: string): Promise<void> {
    this.pokemonService.setSelectedPokemon(name);

    const modal = this.modalRef().nativeElement as HTMLDialogElement;
    modal.showModal();

    this.isLoading.set(true);
    await this.pokemonService.getPokemonAsync(name);
    this.isLoading.set(false);
  }
}
