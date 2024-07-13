import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PokemonClient } from 'pokenode-ts'

interface Pokemon {
  name: string
  sprite: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  pokemons = signal<Pokemon[]>([])
  selectedPokemon = signal<Pokemon | null>(null)

  ngOnInit(): void {
    const pokemonNames = [
      'bulbasaur',
      'ivysaur',
      'venusaur',
      'charmander',
      'charmeleon',
      'charizard',
      'squirtle',
      'wartortle',
      'blastoise',
      'pikachu'
      // 'raichu',
      // 'gastly',
      // 'haunter',
      // 'gengar',
      // 'eevee',
      // 'vaporeon',
      // 'jolteon',
      // 'flareon',
      // 'snorlax',
      // 'articuno',
      // 'zapdos',
      // 'moltres',
      // 'dratini',
      // 'dragonair',
      // 'dragonite',
      // 'mewtwo',
      // 'mew'
    ]

    this.pokemons.set(
      pokemonNames.map((name) => ({ name, sprite: `sprites-animated/${name}.gif` }))
    )

    setTimeout(async () => {
      const api = new PokemonClient()

      try {
        // const pokemons = await api.listPokemons(0, 151)
        // console.log(pokemons)
        // const first = await api.getPokemonByName(pokemons.results[5].name)
        // console.log(first)
        // this.selectedPokemon.set({
        //   name: first.name,
        //   sprite: `sprites/${first.id}.png`
        // })
      } catch (err) {
        console.error(err)
      }
    }, 0)
  }
}
