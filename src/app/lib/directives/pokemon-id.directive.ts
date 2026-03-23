import { DecimalPipe } from '@angular/common';
import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[pokemonId]',
  host: { class: 'font-mono text-muted' },
  providers: [DecimalPipe]
})
export class PokemonIdDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly decimalPipe = inject(DecimalPipe);

  value = input.required<number>();

  constructor() {
    effect(() => {
      this.el.nativeElement.textContent = '#' + this.decimalPipe.transform(this.value(), '3.0-0');
    });
  }
}
