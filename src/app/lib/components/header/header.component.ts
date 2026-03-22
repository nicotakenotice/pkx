import { Component, computed, inject } from '@angular/core';
import { HeaderService } from '@lib/services';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);
  readonly title = computed(() => this.headerService.title());
}
