import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'surah/:id', loadComponent: () => import('./pages/reader/reader.component').then(m => m.ReaderComponent) },
  { path: 'juz/:id', loadComponent: () => import('./pages/juz/juz.component').then(m => m.JuzComponent) },
  { path: '**', redirectTo: '' }
];