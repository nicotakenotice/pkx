import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { HeaderService, ThemeService } from '@lib/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  readonly headerService = inject(HeaderService);
  readonly themeService = inject(ThemeService);

  title = computed(() => this.headerService.title());
  checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkboxRef');

  ngOnInit(): void {
    // Set initial checked value
    const checkbox = this.checkboxRef().nativeElement;
    checkbox.checked = this.themeService.getTheme() === 'dark';
  }

  toggleTheme(value: boolean) {
    this.themeService.setTheme(value ? 'dark' : 'light');
  }
}
