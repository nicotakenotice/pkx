import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild
} from '@angular/core';
import {
  PokemonCarouselComponent,
  PokemonDetailComponent,
  SearchBoxComponent
} from '@lib/components';
import { HeaderService, PokemonService } from '@lib/services';
import { DiscoverService } from './discover.service';

@Component({
  selector: 'app-discover',
  imports: [PokemonCarouselComponent, PokemonDetailComponent, SearchBoxComponent],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit, AfterViewInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);
  readonly pageService = inject(DiscoverService);

  readonly pokemons = computed(() => this.pokemonService.pokemons());
  readonly selectedPokemon = computed(() => this.pokemonService.selectedPokemon());
  readonly isLoading = computed(() => this.pokemonService.isLoading());

  modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('modalRef');
  carouselRef = viewChild.required<PokemonCarouselComponent>(PokemonCarouselComponent);

  ngOnInit(): void {
    this.headerService.title.set('Discover');
  }

  ngAfterViewInit(): void {
    const current = this.pageService.selectedPokemonSlide();
    if (current?.name) {
      this.carouselRef().scrollTo(current.name, true);
    }
  }

  /* ======================================================================= */

  async getPokemonAsync(name: string): Promise<void> {
    this.pokemonService.setSelectedPokemon(name);
    const modal = this.modalRef().nativeElement;
    modal.showModal();
    await this.pokemonService.getPokemonAsync(name);
  }

  onSlideChange(event: { name: string; index: number }): void {
    this.pageService.setSelectedPokemonSlide(event.name, event.index);
  }

  scrollToPokemon(name: string): void {
    this.carouselRef().scrollTo(name);
  }

  toggleFavoriteSelected(): void {
    const name = this.selectedPokemon()?.name;
    if (name) this.pokemonService.toggleFavoritePokemon(name);
  }
}
