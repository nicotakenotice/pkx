import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  readonly items = [
    {
      text: 'Discover',
      img: 'sprites-animated/bulbasaur.gif',
      url: '/discover'
    },
    {
      text: 'Favorites',
      img: 'sprites-animated/pikachu.gif',
      url: '/favorites'
    }
  ];
}
