import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { PokemonCard } from '@lib/models';

type ResultItem = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-search-box',
  imports: [DecimalPipe],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {
  dataSource = input.required<ResultItem[], PokemonCard[]>({
    transform: (value) => value.map((p) => ({ id: p.id, name: p.name }))
  });
  filteredDataSource = signal<ResultItem[]>([]);
  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  resultsRef = viewChild<ElementRef<HTMLUListElement>>('resultsRef');
  onSelect = output<string>();
  isOpen = signal(false);

  setInputValue(value: string): void {
    if (value.length < 2) {
      this.filteredDataSource.set([]);
      this.isOpen.set(false);
    } else {
      this.filteredDataSource.set(
        this.dataSource().filter((v) => v.name.toUpperCase().includes(value.toUpperCase()))
      );
      this.isOpen.set(true);
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clear();
    } else if (event.key === 'ArrowDown' && this.isOpen()) {
      event.preventDefault();
      const firstItem = this.resultsRef()?.nativeElement.querySelector<HTMLElement>('li');
      firstItem?.focus();
    }
  }

  onResultKeydown(event: KeyboardEvent, item: ResultItem): void {
    const li = event.currentTarget as HTMLElement;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(item.name);
    } else if (event.key === 'Escape') {
      this.clear();
      this.inputRef()?.nativeElement.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = li.nextElementSibling as HTMLElement | null;
      next?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = li.previousElementSibling as HTMLElement | null;
      if (prev) {
        prev.focus();
      } else {
        this.inputRef()?.nativeElement.focus();
      }
    }
  }

  select(name: string): void {
    this.onSelect.emit(name);
    this.clear();
  }

  clear(): void {
    this.inputRef()!.nativeElement.value = '';
    this.filteredDataSource.set([]);
    this.isOpen.set(false);
  }
}
