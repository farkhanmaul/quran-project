import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public online$: Observable<boolean> = this.onlineSubject.asObservable();

  constructor() {
    window.addEventListener('online', () => {
      console.log('App is online');
      this.onlineSubject.next(true);
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      this.onlineSubject.next(false);
    });

    // Register service worker
    this.registerServiceWorker();
  }

  get isOnline(): boolean {
    return this.onlineSubject.value;
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful:', registration);
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
      }
    }
  }

  // Download specific surah for offline use
  async downloadSurah(surahNumber: number): Promise<boolean> {
    if (!this.isOnline) {
      return false;
    }

    try {
      const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy/${surahNumber}.json`;
      const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam/${surahNumber}.json`;
      
      const cache = await caches.open('quran-app-v1');
      
      // Fetch and cache both Arabic and Indonesian versions
      await Promise.all([
        cache.add(arabicUrl),
        cache.add(indonesianUrl)
      ]);

      // Store downloaded surahs list
      const downloadedSurahs = this.getDownloadedSurahs();
      if (!downloadedSurahs.includes(surahNumber)) {
        downloadedSurahs.push(surahNumber);
        localStorage.setItem('offline-surahs', JSON.stringify(downloadedSurahs));
      }

      return true;
    } catch (error) {
      console.error('Failed to download surah:', error);
      return false;
    }
  }

  // Get list of downloaded surahs
  getDownloadedSurahs(): number[] {
    const stored = localStorage.getItem('offline-surahs');
    return stored ? JSON.parse(stored) : [];
  }

  // Remove surah from offline storage
  async removeSurah(surahNumber: number): Promise<boolean> {
    try {
      const cache = await caches.open('quran-app-v1');
      
      const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy/${surahNumber}.json`;
      const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam/${surahNumber}.json`;
      
      await Promise.all([
        cache.delete(arabicUrl),
        cache.delete(indonesianUrl)
      ]);

      // Update downloaded surahs list
      const downloadedSurahs = this.getDownloadedSurahs();
      const index = downloadedSurahs.indexOf(surahNumber);
      if (index > -1) {
        downloadedSurahs.splice(index, 1);
        localStorage.setItem('offline-surahs', JSON.stringify(downloadedSurahs));
      }

      return true;
    } catch (error) {
      console.error('Failed to remove surah:', error);
      return false;
    }
  }

  // Get storage usage estimate
  async getStorageUsage(): Promise<{ used: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      } catch (error) {
        console.error('Failed to get storage estimate:', error);
      }
    }
    return null;
  }
}