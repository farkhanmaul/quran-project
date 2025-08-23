import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface JuzVerse {
  chapter: number;
  verse: number;
  text: string;
}

interface JuzData {
  [key: string]: JuzVerse[];
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
  selector: 'app-juz',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <h1>Juz {{ juzNumber }}</h1>
      </header>
      
      <div class="navigation">
        <a routerLink="/" class="back-btn">← Back to Home</a>
      </div>
      
      <div *ngIf="loading" class="loading">Loading Juz {{ juzNumber }}...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadJuz()" class="retry-btn">Retry</button>
      </div>
      
      <div *ngIf="verses.length > 0" class="verses-container">
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
          <p>API by <a href="https://github.com/fawazahmed0/quran-api" target="_blank">fawazahmed0/quran-api</a></p>
          <p>Built by <a href="https://github.com/farkhanmaul" target="_blank">farkhanmaul</a> with help from <a href="https://claude.ai" target="_blank">Claude</a></p>
          <p>License: Public Domain</p>
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
      margin-bottom: 1.5rem;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin: 0;
      color: #1a202c;
      font-weight: 300;
      font-family: 'Georgia', 'Times', serif;
      letter-spacing: -0.5px;
    }
    
    .controls {
      display: flex;
      justify-content: center;
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
    
    .navigation {
      margin-bottom: 3rem;
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
    
    .verses-container {
      flex: 1;
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
      
      .header {
        flex-direction: column;
        text-align: center;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .verse-text {
        font-size: 1.1rem;
      }
      
      .verse-text.rtl {
        font-size: 1.3rem;
      }
    }
  `]
})
export class JuzComponent implements OnInit {
  juzNumber!: number;
  verses: JuzVerse[] = [];
  translations: TranslationVerse[] = [];
  loading = true;
  error = '';
  fontSize = 16;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.juzNumber = +params['id'];
      if (this.juzNumber >= 1 && this.juzNumber <= 30) {
        this.loadJuz();
      } else {
        this.error = 'Invalid Juz number. Please select a Juz between 1 and 30.';
        this.loading = false;
      }
    });
  }

  loadJuz() {
    this.loading = true;
    this.error = '';
    this.verses = [];
    this.translations = [];

    const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy.json`;
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam.json`;
    
    Promise.all([
      this.http.get<{ quran: JuzVerse[] }>(arabicUrl).toPromise(),
      this.http.get<TranslationResponse>(indonesianUrl).toPromise()
    ]).then(([arabicData, indonesianData]) => {
      const allArabicVerses = arabicData?.quran || [];
      const allIndonesianVerses = indonesianData?.quran || [];
      
      this.verses = this.filterVersesByJuz(allArabicVerses, this.juzNumber);
      this.translations = this.filterVersesByJuz(allIndonesianVerses, this.juzNumber);
      this.loading = false;
    }).catch(err => {
      this.error = `Failed to load Juz ${this.juzNumber}. Please try again.`;
      this.loading = false;
    });
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

  private filterVersesByJuz(verses: JuzVerse[], juzNumber: number): JuzVerse[] {
    // Juz mapping based on traditional Quran division
    const juzRanges: { [key: number]: { start: [number, number], end: [number, number] } } = {
      1: { start: [1, 1], end: [2, 141] },
      2: { start: [2, 142], end: [2, 252] },
      3: { start: [2, 253], end: [3, 92] },
      4: { start: [3, 93], end: [4, 23] },
      5: { start: [4, 24], end: [4, 147] },
      6: { start: [4, 148], end: [5, 81] },
      7: { start: [5, 82], end: [6, 110] },
      8: { start: [6, 111], end: [7, 87] },
      9: { start: [7, 88], end: [8, 40] },
      10: { start: [8, 41], end: [9, 92] },
      11: { start: [9, 93], end: [11, 5] },
      12: { start: [11, 6], end: [12, 52] },
      13: { start: [12, 53], end: [14, 52] },
      14: { start: [15, 1], end: [16, 128] },
      15: { start: [17, 1], end: [18, 74] },
      16: { start: [18, 75], end: [20, 135] },
      17: { start: [21, 1], end: [22, 78] },
      18: { start: [23, 1], end: [25, 20] },
      19: { start: [25, 21], end: [27, 55] },
      20: { start: [27, 56], end: [29, 45] },
      21: { start: [29, 46], end: [33, 30] },
      22: { start: [33, 31], end: [36, 27] },
      23: { start: [36, 28], end: [39, 31] },
      24: { start: [39, 32], end: [41, 46] },
      25: { start: [41, 47], end: [45, 37] },
      26: { start: [46, 1], end: [51, 30] },
      27: { start: [51, 31], end: [57, 29] },
      28: { start: [58, 1], end: [66, 12] },
      29: { start: [67, 1], end: [77, 50] },
      30: { start: [78, 1], end: [114, 6] }
    };

    const range = juzRanges[juzNumber];
    if (!range) return [];

    return verses.filter(verse => {
      const [startChapter, startVerse] = range.start;
      const [endChapter, endVerse] = range.end;
      
      if (verse.chapter < startChapter || verse.chapter > endChapter) {
        return false;
      }
      
      if (verse.chapter === startChapter && verse.verse < startVerse) {
        return false;
      }
      
      if (verse.chapter === endChapter && verse.verse > endVerse) {
        return false;
      }
      
      return true;
    });
  }
}