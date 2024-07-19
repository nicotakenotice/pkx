import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '@lib/utils';

type ThemeName = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  getTheme(): ThemeName {
    return localStorage.getItem(STORAGE_KEY.THEME) as ThemeName;
  }

  setTheme(name: ThemeName): void {
    document.documentElement.dataset[STORAGE_KEY.THEME] = name;
    localStorage.setItem(STORAGE_KEY.THEME, name);

    const metaTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    metaTag.content = name === 'light' ? '#ffffff' : '#1d232a';
  }

  initTheme(): void {
    const name = localStorage.getItem(STORAGE_KEY.THEME) || 'light';
    this.setTheme(name as ThemeName);
  }
}
