import { effect, Injectable, signal } from '@angular/core';
import { StorageKey, Theme } from '@lib/utils';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(localStorage.getItem(StorageKey.Theme) === Theme.Dark || false);

  constructor() {
    effect(() => {
      this.setDarkTheme(this.isDark());
    });
  }

  setDarkTheme(isDark: boolean): void {
    const theme = isDark ? Theme.Dark : Theme.Light;
    document.documentElement.dataset[StorageKey.Theme] = theme;
    localStorage.setItem(StorageKey.Theme, theme);

    // On standalone mode, update the status bar color accordingly
    const metaTag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!;
    metaTag.content = isDark ? '#1d232a' : '#ffffff';
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
  }
}
