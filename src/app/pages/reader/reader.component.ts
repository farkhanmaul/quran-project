import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
        <button (click)="goBack()" class="back-btn">← Kembali</button>
        <h1 class="surah-title">{{ surahName || 'Surah ' + surahNumber }}</h1>
        <div class="header-controls">
          <button (click)="toggleAudio()" class="audio-btn" [class.active]="isPlaying" [disabled]="!verses.length">
            {{ isPlaying ? '⏸️' : '▶️' }}
          </button>
          <button (click)="decreaseFontSize()" class="font-btn">A-</button>
          <button (click)="increaseFontSize()" class="font-btn">A+</button>
          <button (click)="toggleNightMode()" class="mode-btn" [class.active]="nightMode">
            {{ nightMode ? '☀️' : '🌙' }}
          </button>
        </div>
      </header>
      
      <div *ngIf="loading" class="loading">Memuat surah...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadSurah()" class="retry-btn">Coba lagi</button>
      </div>
      
      <div *ngIf="verses && verses.length > 0 && !loading" class="verses">
        <div *ngFor="let verse of verses; let i = index" class="verse" [class.current-verse]="currentPlayingVerse === verse.verse">
          <div class="verse-header">
            <span class="verse-number">{{ verse.verse }}</span>
            <button 
              (click)="playVerse(verse.verse)" 
              class="play-verse-btn"
              title="Putar ayat ini">
              {{ currentPlayingVerse === verse.verse && isPlaying ? '⏸️' : '▶️' }}
            </button>
            <button 
              (click)="toggleBookmark(verse)" 
              class="bookmark-btn"
              [class.active]="isBookmarked(verse)"
              title="Bookmark ayat ini">
              {{ isBookmarked(verse) ? '🔖' : '📎' }}
            </button>
          </div>
          <div class="verse-text arabic" [style.font-size.px]="fontSize">
            {{ verse.text }}
          </div>
          <div *ngIf="translations[i]" class="verse-translation" [style.font-size.px]="fontSize - 2">
            {{ translations[i].text }}
          </div>
        </div>
      </div>
      
      <audio #audioPlayer (ended)="onAudioEnded()" (timeupdate)="onTimeUpdate()" style="display: none;"></audio>
      
      <div *ngIf="verses && verses.length > 0 && !loading" class="navigation">
        <button 
          *ngIf="surahNumber > 1"
          (click)="previousSurah()" 
          class="nav-btn prev">
          ← Surah Sebelumnya
        </button>
        <button 
          *ngIf="surahNumber < 114"
          (click)="nextSurah()" 
          class="nav-btn next">
          Surah Selanjutnya →
        </button>
      </div>
      
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: #ffffff;
      color: #333333;
      transition: all 0.3s ease;
      line-height: 1.6;
    }
    
    .container.night-mode {
      background: #1a1a1a;
      color: #f5f5f5;
    }
    
    .container.night-mode .header {
      border-bottom-color: #333333;
    }
    
    .container.night-mode .verse {
      border-bottom-color: #333333;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .back-btn {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    
    .back-btn:hover {
      background: #e9ecef;
    }
    
    .surah-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }
    
    .container.night-mode .surah-title {
      color: #f5f5f5;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .font-btn, .mode-btn, .audio-btn {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9rem;
    }
    
    .font-btn:hover, .mode-btn:hover, .audio-btn:hover {
      background: #e9ecef;
    }
    
    .mode-btn.active, .audio-btn.active {
      background: #2c3e50;
      color: white;
      border-color: #2c3e50;
    }
    
    .audio-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .loading, .error {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
      font-size: 1.1rem;
    }
    
    .retry-btn {
      background: #2c3e50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.2s;
    }
    
    .retry-btn:hover {
      background: #1a252f;
    }
    
    .verses {
      margin-bottom: 3rem;
    }
    
    .verse {
      padding: 1.5rem 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .verse-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    
    .verse-number {
      background: #2c3e50;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .bookmark-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    
    .bookmark-btn:hover, .bookmark-btn.active {
      opacity: 1;
    }
    
    .play-verse-btn {
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    
    .play-verse-btn:hover {
      opacity: 1;
    }
    
    .verse.current-verse {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }
    
    .container.night-mode .verse.current-verse {
      background: #1e3a8a;
      border-left-color: #3b82f6;
    }
    
    .verse-text {
      direction: rtl;
      text-align: right;
      font-family: 'Amiri', serif;
      line-height: 2;
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .container.night-mode .verse-text {
      color: #f5f5f5;
    }
    
    .verse-translation {
      color: #6c757d;
      line-height: 1.8;
      font-style: italic;
    }
    
    .container.night-mode .verse-translation {
      color: #adb5bd;
    }
    
    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 3rem;
    }
    
    .nav-btn {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }
    
    .nav-btn:hover {
      background: #e9ecef;
      border-color: #adb5bd;
    }
    
    .nav-btn.prev {
      margin-right: auto;
    }
    
    .nav-btn.next {
      margin-left: auto;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .header-controls {
        align-self: flex-end;
      }
      
      .surah-title {
        font-size: 1.25rem;
      }
      
      .verse-text {
        font-size: 1.1rem;
      }
      
      .navigation {
        flex-direction: column;
      }
      
      .nav-btn.prev, .nav-btn.next {
        margin: 0;
      }
    }
  `]
})
export class ReaderComponent implements OnInit, AfterViewInit {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  surahNumber: number = 1;
  surahName: string = '';
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
  isPlaying = false;
  currentPlayingVerse = 0;
  audioPlayer?: HTMLAudioElement;

  private surahNames = [
    'Al-Fatiha', 'Al-Baqarah', 'Aal-E-Imran', 'An-Nisa', 'Al-Maidah', 'Al-Anam', 'Al-Araf', 'Al-Anfal', 'At-Tawbah', 'Yunus',
    'Hud', 'Yusuf', 'Ar-Rad', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
    'Al-Anbiya', 'Al-Hajj', 'Al-Mumenoon', 'An-Noor', 'Al-Furqan', 'Ash-Shuara', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Room',
    'Luqman', 'As-Sajda', 'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
    'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiya', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujraat', 'Qaf',
    'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'Al-Waqia', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahina',
    'As-Saff', 'Al-Jumua', 'Al-Munafiqoon', 'At-Taghabun', 'At-Talaq', 'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haaqqa', 'Al-Maarij',
    'Nooh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddathir', 'Al-Qiyama', 'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Naziat', 'Abasa',
    'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Burooj', 'At-Tariq', 'Al-Ala', 'Al-Ghashiya', 'Al-Fajr', 'Al-Balad',
    'Ash-Shams', 'Al-Lail', 'Ad-Dhuha', 'Ash-Sharh', 'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Baiyyina', 'Az-Zalzala', 'Al-Adiyat',
    'Al-Qaria', 'At-Takathur', 'Al-Asr', 'Al-Humaza', 'Al-Fil', 'Quraish', 'Al-Maun', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
    'Al-Masadd', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
  ];

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
      this.surahName = this.surahNames[this.surahNumber - 1] || `Surah ${this.surahNumber}`;
      this.checkIfDownloaded();
      this.loadSurah();
    });
  }

  ngAfterViewInit() {
    this.audioPlayer = this.audioPlayerRef.nativeElement;
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

  toggleAudio() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playFullSurah();
    }
  }

  playFullSurah() {
    if (this.verses.length === 0) return;
    this.currentPlayingVerse = 1;
    this.playVerse(1);
  }

  playVerse(verseNumber: number) {
    if (!this.audioPlayer) return;
    
    if (this.currentPlayingVerse === verseNumber && this.isPlaying) {
      this.pauseAudio();
      return;
    }

    this.currentPlayingVerse = verseNumber;
    
    // Using Mishary Rashid Al-Afasy recitation from everyayah.com
    // Format: https://everyayah.com/data/Alafasy_128kbps/[chapter]_[verse].mp3
    const paddedChapter = this.surahNumber.toString().padStart(3, '0');
    const paddedVerse = verseNumber.toString().padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedChapter}${paddedVerse}.mp3`;
    
    this.audioPlayer.src = audioUrl;
    this.audioPlayer.play().then(() => {
      this.isPlaying = true;
    }).catch(error => {
      console.error('Error playing audio:', error);
      // Fallback to alternative source if everyayah fails
      this.tryAlternativeAudioSource(verseNumber);
    });
  }

  private tryAlternativeAudioSource(verseNumber: number) {
    if (!this.audioPlayer) return;
    
    // Alternative source: https://cdn.islamic.network/quran/audio/128/ar.alafasy/
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${this.surahNumber}/${verseNumber}.mp3`;
    
    this.audioPlayer.src = audioUrl;
    this.audioPlayer.play().then(() => {
      this.isPlaying = true;
    }).catch(error => {
      console.error('Both audio sources failed:', error);
      this.isPlaying = false;
    });
  }

  pauseAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  onAudioEnded() {
    this.isPlaying = false;
    
    // Auto-play next verse
    const nextVerse = this.currentPlayingVerse + 1;
    if (nextVerse <= this.verses.length) {
      setTimeout(() => {
        this.playVerse(nextVerse);
      }, 1000); // 1 second delay between verses
    } else {
      this.currentPlayingVerse = 0;
    }
  }

  onTimeUpdate() {
    // Optional: Can be used for progress tracking
  }
}