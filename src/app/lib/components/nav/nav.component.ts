import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '@lib/services';
import { Theme } from '@lib/utils';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  readonly themeService = inject(ThemeService);

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

  readonly themes = Object.values(Theme);
  readonly currentTheme = computed(() => this.themeService.currentTheme());

  selectTheme(theme: string, event: Event): void {
    this.themeService.currentTheme.set(theme);
    (event.target as HTMLElement).closest('details')?.removeAttribute('open');
  }
}
