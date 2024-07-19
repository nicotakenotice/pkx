import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);

  pokemons = computed(() => this.pokemonService.pokemons());
  selectedPokemon = computed(() => this.pokemonService.selectedPokemon());
  modalRef = viewChild.required<ElementRef>('modalRef');

  ngOnInit(): void {
    this.headerService.title.set('Discover');
  }

  /* ======================================================================= */

  async getPokemonAsync(name: string, index: number): Promise<void> {
    const modal = this.modalRef().nativeElement as HTMLDialogElement;
    await this.pokemonService.getPokemonAsync(name, index);
    this.selectedPokemon() && modal.showModal();
  }

  log(e: any) {
    // const activeIndex = e.detail[0].activeIndex
    // console.log(activeIndex);
  }
}
