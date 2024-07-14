import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { HeaderService } from '@lib/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);

  title = computed(() => this.headerService.title());
}
