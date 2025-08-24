import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'surah/:id', loadComponent: () => import('./pages/reader/reader.component').then(m => m.ReaderComponent) },
  { path: 'juz/:id', loadComponent: () => import('./pages/juz/juz.component').then(m => m.JuzComponent) },
  { path: 'ruku/:id', loadComponent: () => import('./pages/ruku/ruku.component').then(m => m.RukuComponent) },
  { path: 'page/:id', loadComponent: () => import('./pages/page/page.component').then(m => m.PageComponent) },
  { path: 'manzil/:id', loadComponent: () => import('./pages/manzil/manzil.component').then(m => m.ManzilComponent) },
  { path: 'maqra/:id', loadComponent: () => import('./pages/maqra/maqra.component').then(m => m.MaqraComponent) },
  { path: '**', redirectTo: '' }
];