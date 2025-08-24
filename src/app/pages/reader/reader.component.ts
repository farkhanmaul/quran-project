import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OfflineService } from '../../services/offline.service';

interface Verse {
  chapter: number;
  verse: number;
  text: string;
  sajda?: boolean;
}

interface BookmarkedVerse {
  chapter: number;
  verse: number;
  text: string;
  translation?: string;
  surahName?: string;
  timestamp: number;
}

interface ApiResponse {
  chapter: Verse[];
}

interface TranslationVerse {
  chapter: number;
  verse: number;
  text: string;
}

interface TranslationResponse {
  chapter: TranslationVerse[];
}

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container" [class.night-mode]="nightMode">
      <header class="header">
        <div class="header-top">
          <button (click)="goBack()" class="back-btn">← Back</button>
          <h1>Surah {{ surahNumber }}</h1>
        </div>
      </header>
      
      <div *ngIf="loading" class="loading">Loading surah...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadSurah()" class="retry-btn">Retry</button>
      </div>
      
      <div class="floating-controls">
        <div class="font-controls">
          <button (click)="decreaseFontSize()" class="font-btn">A-</button>
          <span class="font-size-indicator">{{ fontSize }}px</span>
          <button (click)="increaseFontSize()" class="font-btn">A+</button>
          <div class="control-separator"></div>
          <button 
            (click)="toggleDiacritics()" 
            class="control-btn"
            [class.active]="showDiacritics"
            title="Toggle Diacritics">
            ◌َ
          </button>
          <button 
            (click)="toggleNightMode()" 
            class="control-btn"
            [class.active]="nightMode"
            title="Toggle Night Mode">
            {{ nightMode ? '☀️' : '🌙' }}
          </button>
          <div class="control-separator"></div>
          <button 
            (click)="toggleOfflineDownload()" 
            class="control-btn"
            [class.active]="isDownloaded"
            [disabled]="!isOnline && !isDownloaded"
            title="{{ isDownloaded ? 'Remove from offline' : 'Download for offline' }}">
            {{ isDownloaded ? '💾' : '📥' }}
          </button>
        </div>
        <div class="offline-indicator" *ngIf="!isOnline">
          <span class="offline-icon">📵</span>
          <span>Offline Mode</span>
        </div>
      </div>
      
      <div *ngIf="verses && verses.length > 0 && !loading" class="surah-content">
        <div *ngFor="let verse of verses; let i = index" class="verse" [class.sajda-verse]="verse.sajda">
          <div class="verse-number">
            {{ verse.verse }}
            <button 
              (click)="toggleBookmark(verse)" 
              class="bookmark-btn"
              [class.bookmarked]="isBookmarked(verse)"
              title="Bookmark this verse">
              {{ isBookmarked(verse) ? '🔖' : '📌' }}
            </button>
          </div>
          <div class="verse-content">
            <div class="verse-text arabic" [style.font-size.px]="fontSize + 6">
              <span *ngIf="verse.sajda" class="sajda-indicator">🕌</span>
              {{ verse.text }}
            </div>
            <div *ngIf="translations[i]" class="verse-text indonesian" [style.font-size.px]="fontSize">{{ translations[i].text }}</div>
          </div>
        </div>
      </div>
      
      <div *ngIf="verses && verses.length > 0 && !loading" class="navigation">
        <button 
          *ngIf="surahNumber > 1"
          (click)="previousSurah()" 
          class="nav-btn">
          ← Previous Surah
        </button>
        
        <button 
          *ngIf="surahNumber < 114"
          (click)="nextSurah()" 
          class="nav-btn">
          Next Surah →
        </button>
      </div>
      
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-links">
            <a href="https://github.com/fawazahmed0/quran-api" target="_blank" class="footer-link">
              <span class="icon">🔗</span>
              API
            </a>
            <a href="https://github.com/farkhanmaul" target="_blank" class="footer-link">
              <span class="icon">👨‍💻</span>
              farkhanmaul
            </a>
            <a href="https://claude.ai" target="_blank" class="footer-link">
              <span class="icon">🤖</span>
              <strong>Claude</strong>
            </a>
          </div>
          <p class="license">
            <span class="icon">📄</span>
            License: MIT
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 4rem;
      min-height: 100vh;
      background: #fafafa;
      color: #2c3e50;
      transition: all 0.3s ease;
    }
    
    .container.night-mode {
      background: #1a202c;
      color: #f7fafc;
    }
    
    .container.night-mode .header {
      border-bottom-color: #4a5568;
    }
    
    .container.night-mode .verse {
      background: #2d3748;
      border-color: #4a5568;
    }
    
    .container.night-mode .verse:hover {
      border-color: #718096;
    }
    
    .container.night-mode .footer {
      background: #2d3748;
      border-top-color: #4a5568;
    }
    
    .header {
      margin-bottom: 3rem;
      padding: 2rem 0;
      border-bottom: 1px solid #e8e9ea;
    }
    
    .header-top {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }
    
    .floating-controls {
      position: fixed;
      top: 50%;
      right: 2rem;
      transform: translateY(-50%);
      z-index: 1000;
    }
    
    .font-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      background: white;
      padding: 1rem 0.75rem;
      border-radius: 12px;
      border: 1px solid #d1d5db;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
    }
    
    .font-btn {
      background: #f7fafc;
      color: #4a5568;
      border: 1px solid #d1d5db;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .font-btn:hover {
      background: #edf2f7;
      border-color: #a0aec0;
    }
    
    .font-size-indicator {
      color: #4a5568;
      font-size: 0.8rem;
      text-align: center;
      font-weight: 500;
      writing-mode: horizontal-tb;
    }
    
    .control-separator {
      width: 100%;
      height: 1px;
      background: #d1d5db;
      margin: 0.5rem 0;
    }
    
    .control-btn {
      background: #f7fafc;
      color: #4a5568;
      border: 1px solid #d1d5db;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .control-btn:hover {
      background: #edf2f7;
      border-color: #a0aec0;
    }
    
    .control-btn.active {
      background: #2d3748;
      color: white;
      border-color: #2d3748;
    }
    
    .control-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .offline-indicator {
      background: #fed7d7;
      color: #c53030;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .offline-icon {
      font-size: 1.1em;
    }
    
    .back-btn {
      background: white;
      border: 1px solid #d1d5db;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      color: #4a5568;
      transition: all 0.2s ease;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .back-btn:hover {
      background: #f7fafc;
      border-color: #a0aec0;
    }
    
    .header h1 {
      margin: 0;
      color: #1a202c;
      font-size: 2.5rem;
      font-weight: 300;
      font-family: 'Georgia', 'Times', serif;
      letter-spacing: -0.5px;
    }
    
    .loading, .error {
      text-align: center;
      padding: 4rem;
      color: #4a5568;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      font-size: 1.1rem;
    }
    
    .retry-btn {
      background: #2d3748;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .retry-btn:hover {
      background: #1a202c;
    }
    
    .surah-content {
      margin-bottom: 3rem;
    }
    
    .verse {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
      padding: 2.5rem;
      background: white;
      border-radius: 12px;
      align-items: flex-start;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    
    .verse:hover {
      border-color: #cbd5e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .verse.sajda-verse {
      border-left: 4px solid #2563eb;
      background: linear-gradient(to right, #eff6ff, #ffffff);
    }
    
    .sajda-indicator {
      color: #2563eb;
      font-size: 1.2em;
      margin-right: 0.5rem;
      vertical-align: middle;
    }
    
    .verse-number {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 60px;
      min-height: 60px;
      background: #2d3748;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      flex-shrink: 0;
      padding: 0.5rem;
    }
    
    .bookmark-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.8rem;
      padding: 0;
      opacity: 0.7;
      transition: all 0.2s ease;
    }
    
    .bookmark-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .bookmark-btn.bookmarked {
      opacity: 1;
    }
    
    .verse-content {
      flex: 1;
    }
    
    .verse-text {
      line-height: 1.8;
      margin-bottom: 1.5rem;
      color: #2d3748;
    }
    
    .verse-text.arabic {
      direction: rtl;
      text-align: right;
      font-family: 'Amiri', 'Times New Roman', serif;
      font-weight: 500;
      color: #1a202c;
      margin-bottom: 2rem;
    }
    
    .verse-text.indonesian {
      color: #4a5568;
      font-style: italic;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
      line-height: 1.6;
    }
    
    .footer {
      margin-top: 5rem;
      padding: 3rem 0;
      border-top: 1px solid #e2e8f0;
      background: white;
    }
    
    .footer-content {
      text-align: center;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    
    .footer-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4a5568;
      text-decoration: none;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .footer-link:hover {
      color: #2d3748;
    }
    
    .license {
      color: #718096;
      font-size: 0.9rem;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .icon {
      font-size: 1.1em;
    }
    
    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 2rem 0;
      border-top: 1px solid #e2e8f0;
      margin-top: 3rem;
    }
    
    .nav-btn {
      background: #2d3748;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .nav-btn:hover {
      background: #1a202c;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .verse {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .verse-text {
        text-align: center;
      }
      
      .verse-text.arabic {
        text-align: center;
      }
      
      .verse-text.indonesian {
        text-align: center;
      }
      
      .navigation {
        flex-direction: column;
      }
    }
  `]
})
export class ReaderComponent implements OnInit {
  surahNumber: number = 1;
  verses: Verse[] = [];
  translations: TranslationVerse[] = [];
  loading = false;
  error = '';
  fontSize = 16;
  showDiacritics = true;
  nightMode = false;
  bookmarkedVerses: BookmarkedVerse[] = [];
  isOnline = true;
  isDownloaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private offlineService: OfflineService
  ) {}

  ngOnInit() {
    this.loadUserPreferences();
    this.loadBookmarks();
    
    // Subscribe to online status
    this.offlineService.online$.subscribe(online => {
      this.isOnline = online;
    });
    
    this.route.params.subscribe(params => {
      this.surahNumber = +params['id'] || 1;
      this.checkIfDownloaded();
      this.loadSurah();
    });
  }

  loadSurah() {
    this.loading = true;
    this.error = '';
    this.verses = [];
    this.translations = [];

    // Choose Arabic edition based on diacritics preference
    const arabicEdition = this.showDiacritics ? 'ara-quranacademy' : 'ara-quranacademytanzil';
    const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${arabicEdition}/${this.surahNumber}.json`;
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam/${this.surahNumber}.json`;
    
    // Load both Arabic and Indonesian
    Promise.all([
      this.http.get<ApiResponse>(arabicUrl).toPromise(),
      this.http.get<TranslationResponse>(indonesianUrl).toPromise()
    ]).then(([arabicData, indonesianData]) => {
      this.verses = (arabicData?.chapter || []).map(verse => ({
        ...verse,
        sajda: this.isSajdaVerse(verse.chapter, verse.verse)
      }));
      this.translations = indonesianData?.chapter || [];
      this.loading = false;
    }).catch(err => {
      this.error = 'Failed to load surah. Please try again.';
      this.loading = false;
      console.error('API Error:', err);
    });
  }

  private isSajdaVerse(chapter: number, verse: number): boolean {
    // Known Sajda verses in the Quran (14 total)
    const sajdaVerses = [
      { chapter: 7, verse: 206 },
      { chapter: 13, verse: 15 },
      { chapter: 16, verse: 50 },
      { chapter: 17, verse: 109 },
      { chapter: 19, verse: 58 },
      { chapter: 22, verse: 18 },
      { chapter: 22, verse: 77 },
      { chapter: 25, verse: 60 },
      { chapter: 27, verse: 26 },
      { chapter: 32, verse: 15 },
      { chapter: 38, verse: 24 },
      { chapter: 41, verse: 38 },
      { chapter: 53, verse: 62 },
      { chapter: 84, verse: 21 },
      { chapter: 96, verse: 19 }
    ];

    return sajdaVerses.some(sajda => sajda.chapter === chapter && sajda.verse === verse);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  previousSurah() {
    if (this.surahNumber > 1) {
      this.router.navigate(['/surah', this.surahNumber - 1]);
    }
  }

  nextSurah() {
    if (this.surahNumber < 114) {
      this.router.navigate(['/surah', this.surahNumber + 1]);
    }
  }
  
  increaseFontSize() {
    if (this.fontSize < 24) {
      this.fontSize += 2;
      this.saveUserPreferences();
    }
  }

  decreaseFontSize() {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
      this.saveUserPreferences();
    }
  }

  toggleDiacritics() {
    this.showDiacritics = !this.showDiacritics;
    this.saveUserPreferences();
    this.loadSurah(); // Reload with different edition
  }

  toggleNightMode() {
    this.nightMode = !this.nightMode;
    this.saveUserPreferences();
  }

  toggleBookmark(verse: Verse) {
    const existingIndex = this.bookmarkedVerses.findIndex(
      b => b.chapter === verse.chapter && b.verse === verse.verse
    );

    if (existingIndex >= 0) {
      this.bookmarkedVerses.splice(existingIndex, 1);
    } else {
      const translation = this.translations.find(t => t.verse === verse.verse);
      const bookmark: BookmarkedVerse = {
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        translation: translation?.text,
        surahName: `Surah ${verse.chapter}`,
        timestamp: Date.now()
      };
      this.bookmarkedVerses.push(bookmark);
    }
    this.saveBookmarks();
  }

  isBookmarked(verse: Verse): boolean {
    return this.bookmarkedVerses.some(
      b => b.chapter === verse.chapter && b.verse === verse.verse
    );
  }

  private loadUserPreferences() {
    const preferences = localStorage.getItem('quran-preferences');
    if (preferences) {
      const prefs = JSON.parse(preferences);
      this.fontSize = prefs.fontSize || 16;
      this.showDiacritics = prefs.showDiacritics !== undefined ? prefs.showDiacritics : true;
      this.nightMode = prefs.nightMode || false;
    }
  }

  private saveUserPreferences() {
    const preferences = {
      fontSize: this.fontSize,
      showDiacritics: this.showDiacritics,
      nightMode: this.nightMode
    };
    localStorage.setItem('quran-preferences', JSON.stringify(preferences));
  }

  private loadBookmarks() {
    const bookmarks = localStorage.getItem('quran-bookmarks');
    if (bookmarks) {
      this.bookmarkedVerses = JSON.parse(bookmarks);
    }
  }

  private saveBookmarks() {
    localStorage.setItem('quran-bookmarks', JSON.stringify(this.bookmarkedVerses));
  }

  checkIfDownloaded() {
    const downloadedSurahs = this.offlineService.getDownloadedSurahs();
    this.isDownloaded = downloadedSurahs.includes(this.surahNumber);
  }

  async toggleOfflineDownload() {
    if (this.isDownloaded) {
      // Remove from offline storage
      const success = await this.offlineService.removeSurah(this.surahNumber);
      if (success) {
        this.isDownloaded = false;
        console.log(`Surah ${this.surahNumber} removed from offline storage`);
      }
    } else {
      // Download for offline use
      if (!this.isOnline) {
        return; // Can't download when offline
      }
      
      const success = await this.offlineService.downloadSurah(this.surahNumber);
      if (success) {
        this.isDownloaded = true;
        console.log(`Surah ${this.surahNumber} downloaded for offline use`);
      }
    }
  }
}