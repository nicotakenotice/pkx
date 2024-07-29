import { Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, NavComponent, SplashScreenComponent } from '@lib/components';
import { ThemeService } from '@lib/services';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavComponent, SplashScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly themeService = inject(ThemeService);

  private _resizeEvent$ = fromEvent(window, 'resize').pipe(takeUntilDestroyed());

  showSplashScreen = signal<boolean>(true);

  ngOnInit(): void {
    this.themeService.initTheme();
    this.setViewHeight(window.innerHeight); // Set initial value
    this._resizeEvent$.subscribe(() => this.setViewHeight(window.innerHeight)); // Update on resize

    setTimeout(() => {
      this.showSplashScreen.set(false);
    }, 1500);
  }

  setViewHeight(height: number): void {
    document.documentElement.style.setProperty('--view-height', `${height}px`);
  }
}
