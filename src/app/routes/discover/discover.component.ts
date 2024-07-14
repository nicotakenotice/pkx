import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { Pokemon } from '@lib/models';
import { HeaderService } from '@lib/services';
import { pokemonNames } from '@lib/utils';
import { PokemonClient } from 'pokenode-ts';

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

  pokemons = signal<Pokemon[]>([]);
  selectedPokemon = signal<Pokemon | null>(null);

  ngOnInit(): void {
    this.headerService.title.set('Discover');

    this.getPokemons();
  }

  getPokemons(): void {
    this.pokemons.set(
      pokemonNames.map((name) => ({ name, sprite: `sprites-animated/${name}.gif` }))
    );
  }

  async getPokemonList(): Promise<void> {
    const api = new PokemonClient();
    try {
      const pokemons = await api.listPokemons(0, 151);
      console.log(pokemons);
      const first = await api.getPokemonByName(pokemons.results[5].name);
      console.log(first);
      this.selectedPokemon.set({
        name: first.name,
        sprite: `sprites/${first.id}.png`
      });
    } catch (err) {
      console.error(err);
    }
  }
}
