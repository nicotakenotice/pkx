import { Injectable } from '@angular/core';

declare var ColorThief: any;

@Injectable({ providedIn: 'root' })
export class ColorThiefService {
  readonly colorThief = new ColorThief();
}
