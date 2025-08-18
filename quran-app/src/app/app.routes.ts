import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SurahListComponent } from './components/quran/surah-list/surah-list.component';

export const routes: Routes = [
  // Home/Dashboard route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Quran routes
  { path: 'quran', component: SurahListComponent },
  // { path: 'quran/:surahNumber', component: QuranReaderComponent },
  // { path: 'quran/:surahNumber/:ayahNumber', component: QuranReaderComponent },

  // TODO: Uncomment routes when components are implemented
  // Prayer routes
  // { path: 'prayer-times', component: PrayerTimesComponent },

  // Qibla route
  // { path: 'qibla', component: QiblaCompassComponent },

  // Bookmarks route
  // { path: 'bookmarks', component: BookmarkListComponent },

  // Settings route
  // { path: 'settings', component: AppSettingsComponent },

  // TODO: Search route
  // { path: 'search', component: SearchComponent },

  // TODO: About route
  // { path: 'about', component: AboutComponent },

  // Wildcard route for 404
  { path: '**', redirectTo: '/dashboard' }
];
