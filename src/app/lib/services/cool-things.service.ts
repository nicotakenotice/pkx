import { Injectable } from '@angular/core';

declare var ColorThief: any;
declare var Fireworks: any;

export const FIREWORKS_DURATION = 4000;

@Injectable({ providedIn: 'root' })
export class CoolThingsService {
  readonly colorThief = new ColorThief();

  /**
   * @see https://github.com/crashmax-dev/fireworks-js
   */
  fireworks(container: Element, options: any = {}): void {
    const fireworks = new Fireworks.default(container, options);
    fireworks.start();
    setTimeout(() => {
      fireworks.stop(true);
    }, FIREWORKS_DURATION);
  }
}
