import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface MaqraVerse {
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
  selector: 'app-maqra',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-top">
          <h1>Maqra {{ maqraNumber }}</h1>
          <p class="maqra-subtitle">{{ getMaqraDescription(maqraNumber) }}</p>
        </div>
      </header>
      
      <div class="navigation">
        <a routerLink="/" class="back-btn">← Back to Home</a>
        <div class="maqra-nav">
          <button *ngIf="maqraNumber > 1" (click)="previousMaqra()" class="nav-btn">← Prev</button>
          <span class="maqra-indicator">{{ maqraNumber }} / 21</span>
          <button *ngIf="maqraNumber < 21" (click)="nextMaqra()" class="nav-btn">Next →</button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">Loading Maqra {{ maqraNumber }}...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadMaqra()" class="retry-btn">Retry</button>
      </div>
      
      <div class="floating-controls">
        <div class="font-controls">
          <button (click)="decreaseFontSize()" class="font-btn">A-</button>
          <span class="font-size-indicator">{{ fontSize }}px</span>
          <button (click)="increaseFontSize()" class="font-btn">A+</button>
        </div>
      </div>
      
      <div *ngIf="verses.length > 0" class="verses-container">
        <div class="maqra-info">
          <h3>Maqra {{ maqraNumber }}</h3>
          <p>Traditional section division for systematic Quranic study</p>
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
    
    .maqra-subtitle {
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
    
    .maqra-nav {
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
    
    .maqra-indicator {
      color: #4a5568;
      font-weight: 600;
      padding: 0.75rem 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #d1d5db;
    }
    
    .maqra-info {
      background: linear-gradient(135deg, #4299e1, #3182ce);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .maqra-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .maqra-info p {
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
      
      .maqra-nav {
        justify-content: center;
      }
    }
  `]
})
export class MaqraComponent implements OnInit {
  maqraNumber!: number;
  verses: MaqraVerse[] = [];
  translations: TranslationVerse[] = [];
  loading = true;
  error = '';
  fontSize = 16;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.maqraNumber = +params['id'];
      if (this.maqraNumber >= 1 && this.maqraNumber <= 21) {
        this.loadMaqra();
      } else {
        this.error = 'Invalid Maqra number. Please select a Maqra between 1 and 21.';
        this.loading = false;
      }
    });
  }

  loadMaqra() {
    this.loading = true;
    this.error = '';
    this.verses = [];
    this.translations = [];

    const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy.json`;
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam.json`;
    
    Promise.all([
      this.http.get<{ quran: MaqraVerse[] }>(arabicUrl).toPromise(),
      this.http.get<TranslationResponse>(indonesianUrl).toPromise()
    ]).then(([arabicData, indonesianData]) => {
      const allArabicVerses = arabicData?.quran || [];
      const allIndonesianVerses = indonesianData?.quran || [];
      
      this.verses = this.filterVersesByMaqra(allArabicVerses, this.maqraNumber);
      this.translations = this.filterVersesByMaqra(allIndonesianVerses, this.maqraNumber);
      this.loading = false;
    }).catch(err => {
      this.error = `Failed to load Maqra ${this.maqraNumber}. Please try again.`;
      this.loading = false;
    });
  }

  private filterVersesByMaqra(verses: MaqraVerse[], maqraNumber: number): MaqraVerse[] {
    // Maqra boundaries (approximate - typically 21 sections)
    const versesPerMaqra = Math.ceil(6236 / 21);
    const startIndex = (maqraNumber - 1) * versesPerMaqra;
    const endIndex = Math.min(startIndex + versesPerMaqra, verses.length);
    
    return verses.slice(startIndex, endIndex);
  }

  getMaqraDescription(maqraNumber: number): string {
    return `Traditional section ${maqraNumber} for Quranic study`;
  }

  previousMaqra() {
    if (this.maqraNumber > 1) {
      window.location.href = `/maqra/${this.maqraNumber - 1}`;
    }
  }

  nextMaqra() {
    if (this.maqraNumber < 21) {
      window.location.href = `/maqra/${this.maqraNumber + 1}`;
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