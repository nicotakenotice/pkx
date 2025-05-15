import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { PokemonCard } from '@lib/models';

@Component({
  selector: 'app-search-box',
  imports: [CommonModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {
  dataSource = input.required<string[], PokemonCard[]>({
    transform: (value) => value.map((p) => p.name)
  });
  filteredDataSource = signal<string[]>([]);
  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  onSelect = output<string>();

  setInputValue(value: string): void {
    if (value.length < 3) {
      this.filteredDataSource.set([]);
    } else {
      this.filteredDataSource.set(
        this.dataSource().filter((v) => v.toUpperCase().includes(value.toUpperCase()))
      );
    }
  }

  select(name: string): void {
    this.onSelect.emit(name);
    this.inputRef()!.nativeElement.value = '';
  }
}
