import { effect, Injectable, signal } from '@angular/core';
import { STORAGE_KEY, THEME } from '@lib/utils';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(localStorage.getItem(STORAGE_KEY.THEME) === THEME.DARK || false);

  constructor() {
    effect(() => {
      this.setDarkTheme(this.isDark());
    });
  }

  setDarkTheme(isDark: boolean): void {
    const theme = isDark ? THEME.DARK : THEME.LIGHT;
    document.documentElement.dataset[STORAGE_KEY.THEME] = theme;
    localStorage.setItem(STORAGE_KEY.THEME, theme);

    // On standalone mode, update the status bar color accordingly
    const metaTag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!;
    metaTag.content = isDark ? '#1d232a' : '#ffffff';
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
  }
}
