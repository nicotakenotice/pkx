import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChildren
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderService, PokemonService } from '@lib/services';

declare var Hammer: any;

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly pokemonService = inject(PokemonService);

  displayMode = signal<'list' | 'grid'>('list');
  pokemons = computed(() => this.pokemonService.pokemons().filter((p) => p.isFavorite));
  listItems = viewChildren<ElementRef<HTMLDivElement>>('listItem');

  constructor() {
    effect(() => {
      const listItems = this.listItems().map((o) => o.nativeElement);
      listItems.forEach((element) => {
        const hammer = new Hammer(element);
        hammer.on('panleft panright', (e: any) => {
          // console.log(e);

          if (e.isFirst) {
            element.style.transitionDuration = '0s';
          }

          element.style.left = `${e.deltaX}px`;
          
          if (e.isFinal) {
            element.style.left = '0px';
            element.style.transitionDuration = '0.2s';
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.headerService.title.set('Favorites');
  }

  toggleDisplayMode(): void {
    const currentMode = this.displayMode();
    this.displayMode.set(currentMode === 'list' ? 'grid' : 'list');
  }
}
