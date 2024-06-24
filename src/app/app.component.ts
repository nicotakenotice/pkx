import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonClient } from 'pokenode-ts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  selectedPokemon = signal<{ name: string; sprite: string } | null>(null);

  ngOnInit(): void {
    setTimeout(async () => {
      const api = new PokemonClient();

      try {
        const pokemons = await api.listPokemons(0, 151);
        const first = await api.getPokemonByName(pokemons.results[0].name);
        console.log(first);
        this.selectedPokemon.set({
          name: first.name,
          sprite: `sprites/${first.id}.png`
        });
      } catch (err) {
        console.error(err);
      }
    }, 0);
  }
}
