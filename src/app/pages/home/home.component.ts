import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Surah {
  chapter: number;
  name: string;
  juz: number;
  verses: number;
}

interface SearchResult {
  chapter: number;
  verse: number;
  surahName: string;
  arabicText: string;
  translationText: string;
  highlightedArabic: string;
  highlightedTranslation: string;
}

interface QuranVerse {
  chapter: number;
  verse: number;
  text: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <h1>Al-Quran</h1>
        <p>Choose how to read the Quran</p>
      </header>
      
      <div class="reading-modes">
        <div class="mode-tabs">
          <button 
            class="tab" 
            [class.active]="currentMode === 'surah'"
            (click)="switchMode('surah')">
            By Surah
          </button>
          <button 
            class="tab" 
            [class.active]="currentMode === 'juz'"
            (click)="switchMode('juz')">
            By Juz
          </button>
          <button 
            class="tab" 
            [class.active]="currentMode === 'ruku'"
            (click)="switchMode('ruku')">
            By Ruku
          </button>
          <button 
            class="tab" 
            [class.active]="currentMode === 'pages'"
            (click)="switchMode('pages')">
            By Pages
          </button>
          <button 
            class="tab" 
            [class.active]="currentMode === 'manzil'"
            (click)="switchMode('manzil')">
            By Manzil
          </button>
          <button 
            class="tab" 
            [class.active]="currentMode === 'maqra'"
            (click)="switchMode('maqra')">
            By Maqra
          </button>
        </div>
      </div>
      
      <div class="filters" *ngIf="currentMode === 'surah'">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="filterSurahs()"
            placeholder="Search in Quran..." 
            class="search-input">
        </div>
        <div class="filter-options">
          <button 
            class="filter-btn"
            [class.active]="showSearchMode"
            (click)="toggleSearchMode()">
            Search in Content
          </button>
        </div>
      </div>
      
      <div *ngIf="currentMode === 'surah' && !showSearchMode" class="surah-list">
        <a 
          *ngFor="let surah of filteredSurahs" 
          [routerLink]="['/surah', surah.chapter]"
          class="surah-card">
          <span class="surah-number">{{ surah.chapter }}</span>
          <div class="surah-info">
            <span class="surah-name">{{ surah.name }}</span>
            <span class="surah-meta">{{ surah.verses }} verses • Juz {{ surah.juz }}</span>
          </div>
        </a>
      </div>
      
      <div *ngIf="showSearchMode && searchQuery.length > 2" class="search-results">
        <div *ngIf="searchLoading" class="loading">Searching...</div>
        <div *ngIf="searchResults.length > 0 && !searchLoading" class="search-list">
          <div *ngFor="let result of searchResults" class="search-result-card">
            <div class="result-reference">{{ result.surahName }} {{ result.chapter }}:{{ result.verse }}</div>
            <div class="result-text arabic" [innerHTML]="result.highlightedArabic"></div>
            <div class="result-text indonesian" [innerHTML]="result.highlightedTranslation"></div>
          </div>
        </div>
        <div *ngIf="searchResults.length === 0 && !searchLoading && searchQuery.length > 2" class="no-search-results">
          <p>No verses found for "{{ searchQuery }}"</p>
        </div>
      </div>
      
      <div *ngIf="currentMode === 'juz'" class="juz-list">
        <a 
          *ngFor="let juz of juzList" 
          [routerLink]="['/juz', juz]"
          class="juz-card">
          <span class="juz-number">{{ juz }}</span>
          <div class="juz-info">
            <span class="juz-name">Juz {{ juz }}</span>
            <span class="juz-meta">{{ getJuzDescription(juz) }}</span>
          </div>
        </a>
      </div>
      
      <div *ngIf="currentMode === 'ruku'" class="ruku-list">
        <a 
          *ngFor="let ruku of rukuList" 
          [routerLink]="['/ruku', ruku]"
          class="ruku-card">
          <span class="ruku-number">{{ ruku }}</span>
          <div class="ruku-info">
            <span class="ruku-name">Ruku {{ ruku }}</span>
            <span class="ruku-meta">{{ getRukuDescription(ruku) }}</span>
          </div>
        </a>
      </div>
      
      <div *ngIf="currentMode === 'pages'" class="pages-list">
        <a 
          *ngFor="let page of pagesList" 
          [routerLink]="['/page', page]"
          class="page-card">
          <span class="page-number">{{ page }}</span>
          <div class="page-info">
            <span class="page-name">Page {{ page }}</span>
            <span class="page-meta">Mushaf Page</span>
          </div>
        </a>
      </div>
      
      <div *ngIf="currentMode === 'manzil'" class="manzil-list">
        <a 
          *ngFor="let manzil of manzilList" 
          [routerLink]="['/manzil', manzil]"
          class="manzil-card">
          <span class="manzil-number">{{ manzil }}</span>
          <div class="manzil-info">
            <span class="manzil-name">Manzil {{ manzil }}</span>
            <span class="manzil-meta">{{ getManzilDescription(manzil) }}</span>
          </div>
        </a>
      </div>
      
      <div *ngIf="currentMode === 'maqra'" class="maqra-list">
        <a 
          *ngFor="let maqra of maqraList" 
          [routerLink]="['/maqra', maqra]"
          class="maqra-card">
          <span class="maqra-number">{{ maqra }}</span>
          <div class="maqra-info">
            <span class="maqra-name">Maqra {{ maqra }}</span>
            <span class="maqra-meta">{{ getMaqraDescription(maqra) }}</span>
          </div>
        </a>
      </div>
      
      <div *ngIf="loading" class="loading">Loading...</div>
      
      <div *ngIf="currentMode === 'surah' && filteredSurahs.length === 0 && !loading && !showSearchMode" class="no-results">
        <p>No surahs found</p>
        <button (click)="clearFilters()" class="clear-btn">Clear filters</button>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 4rem;
      min-height: 100vh;
      background: #fafafa;
      color: #2c3e50;
    }
    
    .header {
      text-align: center;
      margin-bottom: 4rem;
      padding: 3rem 0;
      border-bottom: 1px solid #e8e9ea;
    }
    
    .header h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #1a202c;
      font-weight: 300;
      letter-spacing: -0.5px;
      font-family: 'Georgia', 'Times', serif;
    }
    
    .header p {
      color: #4a5568;
      font-size: 1.2rem;
      font-weight: 300;
    }
    
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      justify-content: center;
    }
    
    .search-box {
      width: 100%;
      max-width: 500px;
    }
    
    .search-input {
      width: 100%;
      padding: 1rem 1.5rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .search-input:focus {
      outline: none;
      border-color: #2d3748;
      box-shadow: 0 0 0 3px rgba(45, 55, 72, 0.1);
    }
    
    .search-input::placeholder {
      color: #9ca3af;
    }
    
    .filter-options {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
    }
    
    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .filter-btn:hover {
      border-color: #a0aec0;
    }
    
    .filter-btn.active {
      background: #2d3748;
      color: white;
      border-color: #2d3748;
    }
    
    .search-results {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .search-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .search-result-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    
    .search-result-card:hover {
      border-color: #cbd5e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .result-reference {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .result-text {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    
    .result-text.arabic {
      direction: rtl;
      text-align: right;
      font-family: 'Amiri', 'Times New Roman', serif;
      font-size: 1.2rem;
      color: #1a202c;
      margin-bottom: 1.5rem;
    }
    
    .result-text.indonesian {
      color: #4a5568;
      font-style: italic;
    }
    
    .no-search-results {
      text-align: center;
      padding: 4rem;
      color: #4a5568;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .mode-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 3rem;
      justify-content: center;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .tab {
      padding: 1rem 2.5rem;
      border: none;
      background: white;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 1rem;
      border-right: 1px solid #d1d5db;
    }
    
    .tab:last-child {
      border-right: none;
    }
    
    .tab.active {
      background: #2d3748;
      color: white;
    }
    
    .tab:hover:not(.active) {
      background: #f7fafc;
    }
    
    .surah-list, .juz-list, .ruku-list, .pages-list, .manzil-list, .maqra-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .surah-card, .juz-card, .ruku-card, .page-card, .manzil-card, .maqra-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      text-decoration: none;
      color: #2d3748;
      transition: all 0.2s ease;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .surah-card:hover, .juz-card:hover, .ruku-card:hover, .page-card:hover, .manzil-card:hover, .maqra-card:hover {
      border-color: #cbd5e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
    
    .surah-number, .juz-number, .ruku-number, .page-number, .manzil-number, .maqra-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #2d3748;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    
    .surah-info, .juz-info, .ruku-info, .page-info, .manzil-info, .maqra-info {
      flex: 1;
    }
    
    .surah-name, .juz-name, .ruku-name, .page-name, .manzil-name, .maqra-name {
      font-weight: 600;
      display: block;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      color: #1a202c;
    }
    
    .surah-meta, .juz-meta, .ruku-meta, .page-meta, .manzil-meta, .maqra-meta {
      font-size: 0.95rem;
      color: #4a5568;
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
    
    .no-results {
      text-align: center;
      padding: 4rem;
      color: #4a5568;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .clear-btn {
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
    
    .clear-btn:hover {
      background: #1a202c;
    }
    
    .loading {
      text-align: center;
      padding: 4rem;
      color: #4a5568;
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .surah-list, .juz-list, .ruku-list, .pages-list, .manzil-list, .maqra-list {
        grid-template-columns: 1fr;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .mode-tabs {
        flex-direction: column;
      }
      
      .tab {
        padding: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  surahs: Surah[] = [];
  filteredSurahs: Surah[] = [];
  loading = true;
  searchQuery = '';
  showSearchMode = false;
  searchLoading = false;
  searchResults: SearchResult[] = [];
  allVerses: QuranVerse[] = [];
  allTranslations: QuranVerse[] = [];
  juzList = Array.from({length: 30}, (_, i) => i + 1);
  rukuList = Array.from({length: 556}, (_, i) => i + 1);  // Total 556 rukus in Quran
  pagesList = Array.from({length: 604}, (_, i) => i + 1);  // 604 pages in standard Mushaf
  manzilList = Array.from({length: 7}, (_, i) => i + 1);   // 7 manzils
  maqraList = Array.from({length: 21}, (_, i) => i + 1);   // 21 maqras
  currentMode: 'surah' | 'juz' | 'ruku' | 'pages' | 'manzil' | 'maqra' = 'surah';

  // Complete surah data with juz and verse count
  private surahData = [
    { name: 'Al-Fatiha', juz: 1, verses: 7 },
    { name: 'Al-Baqarah', juz: 1, verses: 286 },
    { name: 'Aal-E-Imran', juz: 3, verses: 200 },
    { name: 'An-Nisa', juz: 4, verses: 176 },
    { name: 'Al-Maidah', juz: 6, verses: 120 },
    { name: 'Al-Anam', juz: 7, verses: 165 },
    { name: 'Al-Araf', juz: 8, verses: 206 },
    { name: 'Al-Anfal', juz: 9, verses: 75 },
    { name: 'At-Tawbah', juz: 10, verses: 129 },
    { name: 'Yunus', juz: 11, verses: 109 },
    { name: 'Hud', juz: 11, verses: 123 },
    { name: 'Yusuf', juz: 12, verses: 111 },
    { name: 'Ar-Rad', juz: 13, verses: 43 },
    { name: 'Ibrahim', juz: 13, verses: 52 },
    { name: 'Al-Hijr', juz: 14, verses: 99 },
    { name: 'An-Nahl', juz: 14, verses: 128 },
    { name: 'Al-Isra', juz: 15, verses: 111 },
    { name: 'Al-Kahf', juz: 15, verses: 110 },
    { name: 'Maryam', juz: 16, verses: 98 },
    { name: 'Ta-Ha', juz: 16, verses: 135 },
    { name: 'Al-Anbiya', juz: 17, verses: 112 },
    { name: 'Al-Hajj', juz: 17, verses: 78 },
    { name: 'Al-Mumenoon', juz: 18, verses: 118 },
    { name: 'An-Noor', juz: 18, verses: 64 },
    { name: 'Al-Furqan', juz: 18, verses: 77 },
    { name: 'Ash-Shuara', juz: 19, verses: 227 },
    { name: 'An-Naml', juz: 19, verses: 93 },
    { name: 'Al-Qasas', juz: 20, verses: 88 },
    { name: 'Al-Ankabut', juz: 20, verses: 69 },
    { name: 'Ar-Room', juz: 21, verses: 60 },
    { name: 'Luqman', juz: 21, verses: 34 },
    { name: 'As-Sajda', juz: 21, verses: 30 },
    { name: 'Al-Ahzab', juz: 21, verses: 73 },
    { name: 'Saba', juz: 22, verses: 54 },
    { name: 'Fatir', juz: 22, verses: 45 },
    { name: 'Ya-Sin', juz: 22, verses: 83 },
    { name: 'As-Saffat', juz: 23, verses: 182 },
    { name: 'Sad', juz: 23, verses: 88 },
    { name: 'Az-Zumar', juz: 23, verses: 75 },
    { name: 'Ghafir', juz: 24, verses: 85 },
    { name: 'Fussilat', juz: 24, verses: 54 },
    { name: 'Ash-Shura', juz: 25, verses: 53 },
    { name: 'Az-Zukhruf', juz: 25, verses: 89 },
    { name: 'Ad-Dukhan', juz: 25, verses: 59 },
    { name: 'Al-Jathiya', juz: 25, verses: 37 },
    { name: 'Al-Ahqaf', juz: 26, verses: 35 },
    { name: 'Muhammad', juz: 26, verses: 38 },
    { name: 'Al-Fath', juz: 26, verses: 29 },
    { name: 'Al-Hujraat', juz: 26, verses: 18 },
    { name: 'Qaf', juz: 26, verses: 45 },
    { name: 'Adh-Dhariyat', juz: 26, verses: 60 },
    { name: 'At-Tur', juz: 27, verses: 49 },
    { name: 'An-Najm', juz: 27, verses: 62 },
    { name: 'Al-Qamar', juz: 27, verses: 55 },
    { name: 'Ar-Rahman', juz: 27, verses: 78 },
    { name: 'Al-Waqia', juz: 27, verses: 96 },
    { name: 'Al-Hadid', juz: 27, verses: 29 },
    { name: 'Al-Mujadila', juz: 28, verses: 22 },
    { name: 'Al-Hashr', juz: 28, verses: 24 },
    { name: 'Al-Mumtahina', juz: 28, verses: 13 },
    { name: 'As-Saff', juz: 28, verses: 14 },
    { name: 'Al-Jumua', juz: 28, verses: 11 },
    { name: 'Al-Munafiqoon', juz: 28, verses: 11 },
    { name: 'At-Taghabun', juz: 28, verses: 18 },
    { name: 'At-Talaq', juz: 28, verses: 12 },
    { name: 'At-Tahrim', juz: 28, verses: 12 },
    { name: 'Al-Mulk', juz: 29, verses: 30 },
    { name: 'Al-Qalam', juz: 29, verses: 52 },
    { name: 'Al-Haaqqa', juz: 29, verses: 52 },
    { name: 'Al-Maarij', juz: 29, verses: 44 },
    { name: 'Nooh', juz: 29, verses: 28 },
    { name: 'Al-Jinn', juz: 29, verses: 28 },
    { name: 'Al-Muzzammil', juz: 29, verses: 20 },
    { name: 'Al-Muddathir', juz: 29, verses: 56 },
    { name: 'Al-Qiyama', juz: 29, verses: 40 },
    { name: 'Al-Insan', juz: 29, verses: 31 },
    { name: 'Al-Mursalat', juz: 29, verses: 50 },
    { name: 'An-Naba', juz: 30, verses: 40 },
    { name: 'An-Naziat', juz: 30, verses: 46 },
    { name: 'Abasa', juz: 30, verses: 42 },
    { name: 'At-Takwir', juz: 30, verses: 29 },
    { name: 'Al-Infitar', juz: 30, verses: 19 },
    { name: 'Al-Mutaffifin', juz: 30, verses: 36 },
    { name: 'Al-Inshiqaq', juz: 30, verses: 25 },
    { name: 'Al-Burooj', juz: 30, verses: 22 },
    { name: 'At-Tariq', juz: 30, verses: 17 },
    { name: 'Al-Ala', juz: 30, verses: 19 },
    { name: 'Al-Ghashiya', juz: 30, verses: 26 },
    { name: 'Al-Fajr', juz: 30, verses: 30 },
    { name: 'Al-Balad', juz: 30, verses: 20 },
    { name: 'Ash-Shams', juz: 30, verses: 15 },
    { name: 'Al-Lail', juz: 30, verses: 21 },
    { name: 'Ad-Dhuha', juz: 30, verses: 11 },
    { name: 'Ash-Sharh', juz: 30, verses: 8 },
    { name: 'At-Tin', juz: 30, verses: 8 },
    { name: 'Al-Alaq', juz: 30, verses: 19 },
    { name: 'Al-Qadr', juz: 30, verses: 5 },
    { name: 'Al-Baiyyina', juz: 30, verses: 8 },
    { name: 'Az-Zalzala', juz: 30, verses: 8 },
    { name: 'Al-Adiyat', juz: 30, verses: 11 },
    { name: 'Al-Qaria', juz: 30, verses: 11 },
    { name: 'At-Takathur', juz: 30, verses: 8 },
    { name: 'Al-Asr', juz: 30, verses: 3 },
    { name: 'Al-Humaza', juz: 30, verses: 9 },
    { name: 'Al-Fil', juz: 30, verses: 5 },
    { name: 'Quraish', juz: 30, verses: 4 },
    { name: 'Al-Maun', juz: 30, verses: 7 },
    { name: 'Al-Kawthar', juz: 30, verses: 3 },
    { name: 'Al-Kafirun', juz: 30, verses: 6 },
    { name: 'An-Nasr', juz: 30, verses: 3 },
    { name: 'Al-Masadd', juz: 30, verses: 5 },
    { name: 'Al-Ikhlas', juz: 30, verses: 4 },
    { name: 'Al-Falaq', juz: 30, verses: 5 },
    { name: 'An-Nas', juz: 30, verses: 6 }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSurahs();
    this.loadFullQuran();
  }

  loadSurahs() {
    this.surahs = this.surahData.map((data, index) => ({
      chapter: index + 1,
      name: data.name,
      juz: data.juz,
      verses: data.verses
    }));
    this.filteredSurahs = [...this.surahs];
    this.loading = false;
  }

  filterSurahs() {
    if (this.showSearchMode) {
      this.performContentSearch();
    } else {
      this.filteredSurahs = this.surahs.filter(surah => {
        const matchesSearch = !this.searchQuery || 
          surah.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          surah.chapter.toString().includes(this.searchQuery);
        
        return matchesSearch;
      });
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterSurahs();
  }

  switchMode(mode: 'surah' | 'juz' | 'ruku' | 'pages' | 'manzil' | 'maqra') {
    this.currentMode = mode;
    if (mode === 'surah') {
      this.clearFilters();
    }
  }

  getJuzDescription(juzNumber: number): string {
    const juzDescriptions: { [key: number]: string } = {
      1: 'Al-Fatiha - Al-Baqarah (141)',
      2: 'Al-Baqarah (142-252)',
      3: 'Al-Baqarah (253) - Aal-E-Imran (92)',
      4: 'Aal-E-Imran (93) - An-Nisa (23)',
      5: 'An-Nisa (24-147)',
      6: 'An-Nisa (148) - Al-Maidah (81)',
      7: 'Al-Maidah (82) - Al-Anam (110)',
      8: 'Al-Anam (111) - Al-Araf (87)',
      9: 'Al-Araf (88) - Al-Anfal (40)',
      10: 'Al-Anfal (41) - At-Tawbah (92)',
      11: 'At-Tawbah (93) - Hud (5)',
      12: 'Hud (6) - Yusuf (52)',
      13: 'Yusuf (53) - Ibrahim (52)',
      14: 'Al-Hijr - An-Nahl',
      15: 'Al-Isra - Al-Kahf (74)',
      16: 'Al-Kahf (75) - Ta-Ha',
      17: 'Al-Anbiya - Al-Hajj',
      18: 'Al-Mumenoon - Al-Furqan (20)',
      19: 'Al-Furqan (21) - An-Naml (55)',
      20: 'An-Naml (56) - Al-Ankabut (45)',
      21: 'Al-Ankabut (46) - Al-Ahzab (30)',
      22: 'Al-Ahzab (31) - Ya-Sin (27)',
      23: 'Ya-Sin (28) - Az-Zumar (31)',
      24: 'Az-Zumar (32) - Fussilat (46)',
      25: 'Fussilat (47) - Al-Jathiya',
      26: 'Al-Ahqaf - Adh-Dhariyat (30)',
      27: 'Adh-Dhariyat (31) - Al-Hadid',
      28: 'Al-Mujadila - At-Tahrim',
      29: 'Al-Mulk - Al-Mursalat',
      30: 'An-Naba - An-Nas'
    };
    return juzDescriptions[juzNumber] || `Juz ${juzNumber}`;
  }

  getRukuDescription(rukuNumber: number): string {
    // Sample descriptions for first few rukus
    const rukuDescriptions: { [key: number]: string } = {
      1: 'Opening verses of Al-Fatiha',
      2: 'Beginning of Al-Baqarah',
      3: 'Story of Adam',
      4: 'Children of Israel',
      5: 'Story of the Cow'
    };
    return rukuDescriptions[rukuNumber] || `Ruku section ${rukuNumber}`;
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

  getMaqraDescription(maqraNumber: number): string {
    return `Traditional section ${maqraNumber} for systematic study`;
  }

  loadFullQuran() {
    const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy.json`;
    const indonesianUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ind-indonesianislam.json`;
    
    Promise.all([
      this.http.get<{ quran: QuranVerse[] }>(arabicUrl).toPromise(),
      this.http.get<{ quran: QuranVerse[] }>(indonesianUrl).toPromise()
    ]).then(([arabicData, indonesianData]) => {
      this.allVerses = arabicData?.quran || [];
      this.allTranslations = indonesianData?.quran || [];
    }).catch(err => {
      console.error('Failed to load full Quran for search:', err);
    });
  }

  toggleSearchMode() {
    this.showSearchMode = !this.showSearchMode;
    this.searchResults = [];
    if (!this.showSearchMode) {
      this.searchQuery = '';
      this.filterSurahs();
    }
  }

  performContentSearch() {
    if (this.searchQuery.length < 3) {
      this.searchResults = [];
      return;
    }

    this.searchLoading = true;
    
    // Search in both Arabic and Indonesian texts
    const query = this.searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    this.allVerses.forEach((verse, index) => {
      const translation = this.allTranslations[index];
      const arabicMatch = verse.text.toLowerCase().includes(query);
      const translationMatch = translation && translation.text.toLowerCase().includes(query);
      
      if (arabicMatch || translationMatch) {
        const surahName = this.surahData[verse.chapter - 1]?.name || `Surah ${verse.chapter}`;
        
        results.push({
          chapter: verse.chapter,
          verse: verse.verse,
          surahName,
          arabicText: verse.text,
          translationText: translation?.text || '',
          highlightedArabic: this.highlightText(verse.text, this.searchQuery),
          highlightedTranslation: translation ? this.highlightText(translation.text, this.searchQuery) : ''
        });
      }
    });

    this.searchResults = results.slice(0, 50); // Limit results for performance
    this.searchLoading = false;
  }

  private highlightText(text: string, query: string): string {
    if (!query || query.length < 3) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: #fef3c7; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">$1</mark>');
  }
}