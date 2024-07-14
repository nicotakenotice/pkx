import { Routes } from '@angular/router';
import { DiscoverComponent } from './routes/discover/discover.component';
import { FavoritesComponent } from './routes/favorites/favorites.component';

export const routes: Routes = [
  {
    path: 'discover',
    component: DiscoverComponent,
    pathMatch: 'full'
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: '',
    redirectTo: '/discover',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
