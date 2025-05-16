import { Component, computed, inject } from '@angular/core';
import { HeaderService, ThemeService } from '@lib/services';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);
  readonly themeService = inject(ThemeService);

  title = computed(() => this.headerService.title());
  isDark = computed(() => this.themeService.isDark());

  toggleTheme() {
    this.themeService.toggle();
  }
}
