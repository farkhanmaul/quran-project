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
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: white;
    }
    
    .header {
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 2rem;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .header-top {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .font-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem;
      border-radius: 25px;
    }
    
    .font-btn {
      background: rgba(255, 255, 255, 0.3);
      color: white;
      border: none;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
    }
    
    .font-btn:hover {
      background: rgba(255, 255, 255, 0.5);
      transform: scale(1.1);
    }
    
    .font-size-indicator {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      min-width: 50px;
      text-align: center;
    }
    
    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      color: white;
      transition: all 0.3s ease;
      font-weight: 500;
      backdrop-filter: blur(10px);
    }
    
    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    .header h1 {
      margin: 0;
      color: white;
      font-size: 2rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .loading, .error {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      font-size: 1.1rem;
    }
    
    .retry-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      margin-top: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    .surah-content {
      margin-bottom: 3rem;
    }
    
    .verse {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      align-items: flex-start;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }
    
    .verse:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .verse-number {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }
    
    .verse-content {
      flex: 1;
    }
    
    .verse-text {
      line-height: 1.8;
      margin-bottom: 1rem;
      color: white;
    }
    
    .verse-text.arabic {
      direction: rtl;
      text-align: right;
      font-family: 'Amiri', 'Times New Roman', serif;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .verse-text.indonesian {
      color: rgba(255, 255, 255, 0.9);
      font-style: italic;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .footer {
      margin-top: 3rem;
      padding: 2rem;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .footer-content {
      text-align: center;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .footer-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .footer-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .license {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .icon {
      font-size: 1.2em;
    }
    
    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      margin-top: 2rem;
    }
    
    .nav-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .nav-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
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
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesian/${this.surahNumber}.json`;
    
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