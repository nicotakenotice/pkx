import { Injectable } from '@angular/core';
import { Fireworks, FireworksTypes } from 'fireworks-js';

export const FireworksDuration = 4000;

@Injectable({ providedIn: 'root' })
export class CoolThingsService {
  startFireworks(container: Element, options?: Partial<FireworksTypes.Options>): void {
    const fireworks = new Fireworks(container, options);
    fireworks.start();
    setTimeout(() => {
      fireworks.stop(true);
    }, FireworksDuration);
  }
}
