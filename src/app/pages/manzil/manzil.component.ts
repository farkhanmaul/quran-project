import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ManzilVerse {
  chapter: number;
  verse: number;
  text: string;
}

interface TranslationVerse {
  chapter: number;
  verse: number;
  text: string;
}

interface TranslationResponse {
  quran: TranslationVerse[];
}

@Component({
  selector: 'app-manzil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-top">
          <h1>Manzil {{ manzilNumber }}</h1>
          <p class="manzil-subtitle">{{ getManzilDescription(manzilNumber) }}</p>
        </div>
      </header>
      
      <div class="navigation">
        <a routerLink="/" class="back-btn">← Back to Home</a>
        <div class="manzil-nav">
          <button *ngIf="manzilNumber > 1" (click)="previousManzil()" class="nav-btn">← Prev</button>
          <span class="manzil-indicator">{{ manzilNumber }} / 7</span>
          <button *ngIf="manzilNumber < 7" (click)="nextManzil()" class="nav-btn">Next →</button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">Loading Manzil {{ manzilNumber }}...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadManzil()" class="retry-btn">Retry</button>
      </div>
      
      <div class="floating-controls">
        <div class="font-controls">
          <button (click)="decreaseFontSize()" class="font-btn">A-</button>
          <span class="font-size-indicator">{{ fontSize }}px</span>
          <button (click)="increaseFontSize()" class="font-btn">A+</button>
        </div>
      </div>
      
      <div *ngIf="verses.length > 0" class="verses-container">
        <div class="manzil-info">
          <h3>Weekly Reading Section {{ manzilNumber }}</h3>
          <p>Complete this Manzil for your weekly Quran reading schedule</p>
        </div>
        
        <div *ngFor="let verse of verses; let i = index" class="verse">
          <div class="verse-info">
            <span class="chapter-verse">{{ verse.chapter }}:{{ verse.verse }}</span>
          </div>
          <div class="verse-content">
            <div class="verse-text arabic" [style.font-size.px]="fontSize + 6">{{ verse.text }}</div>
            <div *ngIf="translations[i]" class="verse-text indonesian" [style.font-size.px]="fontSize">{{ translations[i].text }}</div>
          </div>
        </div>
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
      display: flex;
      flex-direction: column;
      background: #fafafa;
      color: #2c3e50;
    }
    
    .header {
      margin-bottom: 3rem;
      padding: 2rem 0;
      border-bottom: 1px solid #e8e9ea;
    }
    
    .header-top {
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #1a202c;
      font-weight: 300;
      font-family: 'Georgia', 'Times', serif;
      letter-spacing: -0.5px;
    }
    
    .manzil-subtitle {
      color: #4a5568;
      font-size: 1.1rem;
      margin: 0;
      font-style: italic;
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
    }
    
    .navigation {
      margin-bottom: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #4a5568;
      text-decoration: none;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      transition: all 0.2s ease;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .back-btn:hover {
      background: #f7fafc;
      border-color: #a0aec0;
    }
    
    .manzil-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .nav-btn {
      background: #2d3748;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .nav-btn:hover {
      background: #1a202c;
    }
    
    .manzil-indicator {
      color: #4a5568;
      font-weight: 600;
      padding: 0.75rem 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #d1d5db;
    }
    
    .manzil-info {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .manzil-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .manzil-info p {
      margin: 0;
      opacity: 0.9;
    }
    
    .verse {
      margin-bottom: 3rem;
      padding: 2.5rem;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    
    .verse:hover {
      border-color: #cbd5e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .verse-info {
      margin-bottom: 1.5rem;
    }
    
    .chapter-verse {
      display: inline-block;
      background: #2d3748;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .verse-content {
      margin-top: 0;
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
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .floating-controls {
        right: 1rem;
      }
      
      .navigation {
        flex-direction: column;
        align-items: stretch;
      }
      
      .manzil-nav {
        justify-content: center;
      }
    }
  `]
})
export class ManzilComponent implements OnInit {
  manzilNumber!: number;
  verses: ManzilVerse[] = [];
  translations: TranslationVerse[] = [];
  loading = true;
  error = '';
  fontSize = 16;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.manzilNumber = +params['id'];
      if (this.manzilNumber >= 1 && this.manzilNumber <= 7) {
        this.loadManzil();
      } else {
        this.error = 'Invalid Manzil number. Please select a Manzil between 1 and 7.';
        this.loading = false;
      }
    });
  }

  loadManzil() {
    this.loading = true;
    this.error = '';
    this.verses = [];
    this.translations = [];

    const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy.json`;
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam.json`;
    
    Promise.all([
      this.http.get<{ quran: ManzilVerse[] }>(arabicUrl).toPromise(),
      this.http.get<TranslationResponse>(indonesianUrl).toPromise()
    ]).then(([arabicData, indonesianData]) => {
      const allArabicVerses = arabicData?.quran || [];
      const allIndonesianVerses = indonesianData?.quran || [];
      
      this.verses = this.filterVersesByManzil(allArabicVerses, this.manzilNumber);
      this.translations = this.filterVersesByManzil(allIndonesianVerses, this.manzilNumber);
      this.loading = false;
    }).catch(err => {
      this.error = `Failed to load Manzil ${this.manzilNumber}. Please try again.`;
      this.loading = false;
    });
  }

  private filterVersesByManzil(verses: ManzilVerse[], manzilNumber: number): ManzilVerse[] {
    // Manzil boundaries (approximate - for exact boundaries, proper API endpoints would be needed)
    const manzilRanges: { [key: number]: { start: number, end: number } } = {
      1: { start: 0, end: Math.floor(6236 / 7) },
      2: { start: Math.floor(6236 / 7), end: Math.floor(6236 * 2 / 7) },
      3: { start: Math.floor(6236 * 2 / 7), end: Math.floor(6236 * 3 / 7) },
      4: { start: Math.floor(6236 * 3 / 7), end: Math.floor(6236 * 4 / 7) },
      5: { start: Math.floor(6236 * 4 / 7), end: Math.floor(6236 * 5 / 7) },
      6: { start: Math.floor(6236 * 5 / 7), end: Math.floor(6236 * 6 / 7) },
      7: { start: Math.floor(6236 * 6 / 7), end: 6236 }
    };

    const range = manzilRanges[manzilNumber];
    return verses.slice(range.start, range.end);
  }

  getManzilDescription(manzilNumber: number): string {
    const manzilDescriptions: { [key: number]: string } = {
      1: 'Al-Fatiha to An-Nisa (4:87)',
      2: 'An-Nisa (4:88) to Al-Araf (7:87)', 
      3: 'Al-Araf (7:88) to At-Tawbah (9:93)',
      4: 'At-Tawbah (9:94) to An-Nahl (16:50)',
      5: 'An-Nahl (16:51) to Al-Furqan (25:20)',
      6: 'Al-Furqan (25:21) to Ya-Sin (36:27)',
      7: 'Ya-Sin (36:28) to An-Nas (114:6)'
    };
    return manzilDescriptions[manzilNumber] || `Manzil ${manzilNumber}`;
  }

  previousManzil() {
    if (this.manzilNumber > 1) {
      window.location.href = `/manzil/${this.manzilNumber - 1}`;
    }
  }

  nextManzil() {
    if (this.manzilNumber < 7) {
      window.location.href = `/manzil/${this.manzilNumber + 1}`;
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