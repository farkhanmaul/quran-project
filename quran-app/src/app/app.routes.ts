import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SurahListComponent } from './components/quran/surah-list/surah-list.component';
import { QuranReaderComponent } from './components/quran/quran-reader/quran-reader.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  // Home/Dashboard route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Quran routes
  { path: 'quran', component: SurahListComponent },
  { path: 'quran/surah/:id', component: QuranReaderComponent },

  // Settings route
  { path: 'settings', component: SettingsComponent },

  // TODO: Uncomment routes when components are implemented
  // Prayer routes
  // { path: 'prayer-times', component: PrayerTimesComponent },

  // Qibla route
  // { path: 'qibla', component: QiblaCompassComponent },

  // Bookmarks route
  // { path: 'bookmarks', component: BookmarkListComponent },

  // TODO: Search route
  // { path: 'search', component: SearchComponent },

  // TODO: About route
  // { path: 'about', component: AboutComponent },

  // Wildcard route for 404
  { path: '**', redirectTo: '/dashboard' }
];
