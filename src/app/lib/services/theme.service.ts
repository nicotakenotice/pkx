import { effect, Injectable, signal } from '@angular/core';
import { StorageKey, Theme } from '@lib/utils';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<string>(localStorage.getItem(StorageKey.Theme) ?? Theme.Light);

  constructor() {
    effect(() => {
      this._applyTheme(this.currentTheme());
    });
  }

  private _applyTheme(theme: string): void {
    document.documentElement.dataset[StorageKey.Theme] = theme;
    localStorage.setItem(StorageKey.Theme, theme);

    // On standalone mode, update the status bar color using the theme's base-100 color
    const metaTag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!;
    metaTag.content = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-base-100')
      .trim();
  }
}
