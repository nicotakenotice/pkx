import { Component, computed, inject } from '@angular/core';
import { HeaderService, ThemeService } from '@lib/services';
import { Theme } from '@lib/utils';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);
  readonly themeService = inject(ThemeService);
  readonly themes = Object.values(Theme);

  title = computed(() => this.headerService.title());
  currentTheme = computed(() => this.themeService.currentTheme());

  selectTheme(theme: string, event: Event): void {
    this.themeService.currentTheme.set(theme);
    (event.target as HTMLElement).closest('details')?.removeAttribute('open');
  }
}
