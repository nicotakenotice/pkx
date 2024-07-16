import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, NavComponent } from '@lib/components';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private _resizeEvent$ = fromEvent(window, 'resize').pipe(takeUntilDestroyed());

  ngOnInit(): void {
    this.setViewHeight(window.innerHeight); // Set initial value
    this._resizeEvent$.subscribe(() => this.setViewHeight(window.innerHeight)); // Update on resize
  }

  setViewHeight(height: number): void {
    document.documentElement.style.setProperty('--view-height', `${height}px`);
  }
}
