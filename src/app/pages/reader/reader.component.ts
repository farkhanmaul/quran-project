import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Verse {
  chapter: number;
  verse: number;
  text: string;
}

interface ApiResponse {
  chapter: Verse[];
}

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header class="header">
        <button (click)="goBack()" class="back-btn">← Back</button>
        <h1>Surah {{ surahNumber }}</h1>
      </header>
      
      <div *ngIf="loading" class="loading">Loading surah...</div>
      
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadSurah()" class="retry-btn">Retry</button>
      </div>
      
      <div *ngIf="verses && verses.length > 0 && !loading" class="surah-content">
        <div *ngFor="let verse of verses" class="verse">
          <div class="verse-number">{{ verse.verse }}</div>
          <div class="verse-text">{{ verse.text }}</div>
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
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .back-btn {
      background: none;
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      color: #666;
      transition: all 0.2s;
    }
    
    .back-btn:hover {
      background: #f8f9fa;
      border-color: #999;
    }
    
    .header h1 {
      margin: 0;
      color: #333;
    }
    
    .loading, .error {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    
    .retry-btn {
      background: #333;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    
    .surah-content {
      margin-bottom: 3rem;
    }
    
    .verse {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      align-items: flex-start;
    }
    
    .verse-number {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      background: #333;
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .verse-text {
      flex: 1;
      line-height: 1.8;
      font-size: 1.1rem;
      color: #333;
      direction: rtl;
      text-align: right;
      font-family: 'Times New Roman', serif;
    }
    
    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }
    
    .nav-btn {
      background: #333;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .nav-btn:hover {
      background: #555;
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
        direction: ltr;
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
  loading = false;
  error = '';

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

    // Using the working API endpoint
    const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy/${this.surahNumber}.json`;
    
    this.http.get<ApiResponse>(apiUrl).subscribe({
      next: (data) => {
        this.verses = data.chapter || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load surah. Please try again.';
        this.loading = false;
        console.error('API Error:', err);
      }
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
}