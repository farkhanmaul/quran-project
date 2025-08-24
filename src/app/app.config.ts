import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Bookmark, BookmarkCheck, List, Hash, ArrowLeft, ArrowRight, Play, Pause, Minus, Plus, Sun, Moon } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ 
      Bookmark, 
      BookmarkCheck, 
      List, 
      Hash, 
      ArrowLeft, 
      ArrowRight, 
      Play, 
      Pause, 
      Minus, 
      Plus, 
      Sun, 
      Moon 
    }))
  ]
};
