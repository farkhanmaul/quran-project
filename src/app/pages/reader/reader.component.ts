import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Verse {
  chapter: number;
  verse: number;
  text: string;
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
    <div class="container">
      <header class="header">
        <div class="header-top">
          <button (click)="goBack()" class="back-btn">← Back</button>
          <h1>Surah {{ surahNumber }}</h1>
        </div>
        <div class="controls">
          <div class="font-controls">
            <button (click)="decreaseFontSize()" class="font-btn">A-</button>
            <span class="font-size-indicator">{{ fontSize }}px</span>
            <button (click)="increaseFontSize()" class="font-btn">A+</button>
          </div>
        </div>
      </header>
      
      <div *ngIf="loading" class="loading">Loading surah...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadSurah()" class="retry-btn">Retry</button>
      </div>
      
      <div *ngIf="verses && verses.length > 0 && !loading" class="surah-content">
        <div *ngFor="let verse of verses; let i = index" class="verse">
          <div class="verse-number">{{ verse.verse }}</div>
          <div class="verse-content">
            <div class="verse-text arabic" [style.font-size.px]="fontSize + 6">{{ verse.text }}</div>
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
              API by fawazahmed0
            </a>
            <a href="https://github.com/farkhanmaul" target="_blank" class="footer-link">
              <span class="icon">👨‍💻</span>
              Built by farkhanmaul
            </a>
            <a href="https://claude.ai" target="_blank" class="footer-link">
              <span class="icon">🤖</span>
              AI Assistant
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
    
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .font-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
      font-size: 0.9rem;
      min-width: 60px;
      text-align: center;
      font-weight: 500;
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
    
    .verse-number {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 60px;
      height: 60px;
      background: #2d3748;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      flex-shrink: 0;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.surahNumber = +params['id'] || 1;
      this.loadSurah();
    });
  }

  loadSurah() {
    this.loading = true;
    this.error = '';
    this.verses = [];
    this.translations = [];

    // Load Arabic text
    const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy/${this.surahNumber}.json`;
    // Load Indonesian translation  
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam/${this.surahNumber}.json`;
    
    // Load both Arabic and Indonesian
    Promise.all([
      this.http.get<ApiResponse>(arabicUrl).toPromise(),
      this.http.get<TranslationResponse>(indonesianUrl).toPromise()
    ]).then(([arabicData, indonesianData]) => {
      this.verses = arabicData?.chapter || [];
      this.translations = indonesianData?.chapter || [];
      this.loading = false;
    }).catch(err => {
      this.error = 'Failed to load surah. Please try again.';
      this.loading = false;
      console.error('API Error:', err);
    });
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
    }
  }

  decreaseFontSize() {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
    }
  }
}