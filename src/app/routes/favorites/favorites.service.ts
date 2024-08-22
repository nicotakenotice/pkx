import { Injectable, signal } from '@angular/core';

export type DisplayMode = 'list' | 'grid';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  displayMode = signal<DisplayMode>('list');

  setDisplayMode(mode: DisplayMode): void {
    this.displayMode.set(mode);
  }
}
