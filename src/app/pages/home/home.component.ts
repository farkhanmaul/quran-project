import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Bookmark, Search, List, Hash } from 'lucide-angular';

interface Surah {
  chapter: number;
  name: string;
  juz: number;
  verses: number;
  revelationPlace?: 'mecca' | 'medina';
  category?: 'short' | 'medium' | 'long';
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
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-nav">
          <a routerLink="/bookmarks" class="bookmarks-link">
            <lucide-icon name="bookmark"></lucide-icon>
            Bookmarks
          </a>
        </div>
        <h1>القرآن الكريم</h1>
        <p class="subtitle">Al-Quran Digital</p>
      </header>
      
      <div class="navigation-tabs">
        <button 
          class="nav-tab" 
          [class.active]="currentMode === 'surah'"
          (click)="switchMode('surah')">
          <lucide-icon name="list" size="18"></lucide-icon>
          Surah
        </button>
        <button 
          class="nav-tab" 
          [class.active]="currentMode === 'juz'"
          (click)="switchMode('juz')">
          <lucide-icon name="hash" size="18"></lucide-icon>
          Juz
        </button>
      </div>
      
      <div class="search-section" *ngIf="currentMode === 'surah'">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="filterSurahs()"
          placeholder="Cari surah..." 
          class="search-input">
      </div>
      
      <div *ngIf="currentMode === 'surah'" class="surah-grid">
        <a 
          *ngFor="let surah of filteredSurahs" 
          [routerLink]="['/surah', surah.chapter]"
          class="surah-card">
          <div class="surah-header">
            <span class="surah-number">{{ surah.chapter }}</span>
            <span class="surah-name">{{ surah.name }}</span>
          </div>
          <div class="surah-meta">
            {{ surah.verses }} ayat • Juz {{ surah.juz }}
          </div>
        </a>
      </div>
      
      
      <div *ngIf="currentMode === 'juz'" class="juz-grid">
        <a 
          *ngFor="let juz of juzList" 
          [routerLink]="['/juz', juz]"
          class="juz-card">
          <div class="juz-header">
            <span class="juz-number">{{ juz }}</span>
            <span class="juz-name">Juz {{ juz }}</span>
          </div>
          <div class="juz-meta">{{ getJuzDescription(juz) }}</div>
        </a>
      </div>
      
      <div *ngIf="loading" class="loading">Memuat...</div>
      
      <div *ngIf="currentMode === 'surah' && filteredSurahs.length === 0 && !loading" class="no-results">
        <p>Surah tidak ditemukan</p>
        <button (click)="clearFilters()" class="clear-btn">Reset</button>
      </div>
      
      <footer class="footer">
        <div class="footer-content">
          <p class="credits">
            <a href="https://github.com/fawazahmed0/quran-api" target="_blank" rel="noopener">API</a>
            •
            <a href="https://github.com/farkhanmaul" target="_blank" rel="noopener">farkhanmaul</a>
            •
            <strong><a href="https://claude.ai" target="_blank" rel="noopener">Claude</a></strong>
          </p>
          <p class="license">
            <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT License</a>
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: #ffffff;
      color: #333333;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
    }
    
    .header-nav {
      position: absolute;
      top: 0;
      right: 0;
    }
    
    .bookmarks-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      color: #495057;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    
    .bookmarks-link:hover {
      background: #e9ecef;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin: 2rem 0 0.5rem 0;
      color: #2c3e50;
      font-family: 'Amiri', serif;
    }
    
    .subtitle {
      color: #6c757d;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .navigation-tabs {
      display: flex;
      justify-content: center;
      gap: 0;
      margin-bottom: 2rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      overflow: hidden;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
    
    .nav-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      border: none;
      background: #ffffff;
      color: #495057;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      border-right: 1px solid #dee2e6;
    }
    
    .nav-tab:last-child {
      border-right: none;
    }
    
    .nav-tab.active {
      background: #2c3e50;
      color: white;
    }
    
    .nav-tab:hover:not(.active) {
      background: #f8f9fa;
    }
    
    .search-section {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 0.75rem 1rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #2c3e50;
    }
    
    .surah-grid, .juz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .surah-card, .juz-card {
      display: block;
      padding: 1.5rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      text-decoration: none;
      color: #333333;
      transition: all 0.2s;
    }
    
    .surah-card:hover, .juz-card:hover {
      background: #ffffff;
      border-color: #2c3e50;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .surah-header, .juz-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .surah-number, .juz-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #2c3e50;
      color: white;
      border-radius: 6px;
      font-weight: 600;
      font-size: 1rem;
      flex-shrink: 0;
    }
    
    .surah-name, .juz-name {
      font-weight: 600;
      font-size: 1.1rem;
      color: #2c3e50;
    }
    
    .surah-meta, .juz-meta {
      font-size: 0.9rem;
      color: #6c757d;
    }
    
    .no-results {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }
    
    .clear-btn {
      background: #2c3e50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.2s;
    }
    
    .clear-btn:hover {
      background: #1a252f;
    }
    
    .loading {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }
    
    .footer {
      margin-top: 4rem;
      padding: 2rem 0;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }
    
    .footer-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .credits {
      color: #6c757d;
      font-size: 0.9rem;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }
    
    .credits a {
      color: #495057;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .credits a:hover {
      color: #2c3e50;
    }
    
    .license {
      color: #868e96;
      font-size: 0.8rem;
      margin: 0;
    }
    
    .license a {
      color: inherit;
      text-decoration: none;
    }
    
    .license a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .surah-grid, .juz-grid {
        grid-template-columns: 1fr;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .navigation-tabs {
        width: 100%;
      }
      
      .nav-tab {
        flex: 1;
        padding: 0.75rem;
      }
      
      .search-input {
        max-width: none;
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
  selectedRevelationPlace = '';
  selectedCategory = '';
  selectedJuz = '';
  juzList = Array.from({length: 30}, (_, i) => i + 1);
  rukuList = Array.from({length: 556}, (_, i) => i + 1);  // Total 556 rukus in Quran
  pagesList = Array.from({length: 604}, (_, i) => i + 1);  // 604 pages in standard Mushaf
  manzilList = Array.from({length: 7}, (_, i) => i + 1);   // 7 manzils
  maqraList = Array.from({length: 21}, (_, i) => i + 1);   // 21 maqras
  currentMode: 'surah' | 'juz' | 'ruku' | 'pages' | 'manzil' | 'maqra' = 'surah';

  // Complete surah data with juz, verse count, revelation place, and category
  private surahData = [
    { name: 'Al-Fatiha', juz: 1, verses: 7, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Baqarah', juz: 1, verses: 286, revelationPlace: 'medina' as const, category: 'long' as const },
    { name: 'Aal-E-Imran', juz: 3, verses: 200, revelationPlace: 'medina' as const, category: 'long' as const },
    { name: 'An-Nisa', juz: 4, verses: 176, revelationPlace: 'medina' as const, category: 'long' as const },
    { name: 'Al-Maidah', juz: 6, verses: 120, revelationPlace: 'medina' as const, category: 'long' as const },
    { name: 'Al-Anam', juz: 7, verses: 165, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Al-Araf', juz: 8, verses: 206, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Al-Anfal', juz: 9, verses: 75, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'At-Tawbah', juz: 10, verses: 129, revelationPlace: 'medina' as const, category: 'long' as const },
    { name: 'Yunus', juz: 11, verses: 109, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Hud', juz: 11, verses: 123, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Yusuf', juz: 12, verses: 111, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Ar-Rad', juz: 13, verses: 43, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Ibrahim', juz: 13, verses: 52, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Hijr', juz: 14, verses: 99, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'An-Nahl', juz: 14, verses: 128, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Al-Isra', juz: 15, verses: 111, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Al-Kahf', juz: 15, verses: 110, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Maryam', juz: 16, verses: 98, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ta-Ha', juz: 16, verses: 135, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Al-Anbiya', juz: 17, verses: 112, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Al-Hajj', juz: 17, verses: 78, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Mumenoon', juz: 18, verses: 118, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'An-Noor', juz: 18, verses: 64, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Furqan', juz: 18, verses: 77, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ash-Shuara', juz: 19, verses: 227, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'An-Naml', juz: 19, verses: 93, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Qasas', juz: 20, verses: 88, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Ankabut', juz: 20, verses: 69, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ar-Room', juz: 21, verses: 60, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Luqman', juz: 21, verses: 34, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'As-Sajda', juz: 21, verses: 30, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Ahzab', juz: 21, verses: 73, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Saba', juz: 22, verses: 54, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Fatir', juz: 22, verses: 45, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ya-Sin', juz: 22, verses: 83, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'As-Saffat', juz: 23, verses: 182, revelationPlace: 'mecca' as const, category: 'long' as const },
    { name: 'Sad', juz: 23, verses: 88, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Az-Zumar', juz: 23, verses: 75, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ghafir', juz: 24, verses: 85, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Fussilat', juz: 24, verses: 54, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ash-Shura', juz: 25, verses: 53, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Az-Zukhruf', juz: 25, verses: 89, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ad-Dukhan', juz: 25, verses: 59, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Jathiya', juz: 25, verses: 37, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Ahqaf', juz: 26, verses: 35, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Muhammad', juz: 26, verses: 38, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Fath', juz: 26, verses: 29, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Hujraat', juz: 26, verses: 18, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Qaf', juz: 26, verses: 45, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Adh-Dhariyat', juz: 26, verses: 60, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'At-Tur', juz: 27, verses: 49, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'An-Najm', juz: 27, verses: 62, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Qamar', juz: 27, verses: 55, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ar-Rahman', juz: 27, verses: 78, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Waqia', juz: 27, verses: 96, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Hadid', juz: 27, verses: 29, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Mujadila', juz: 28, verses: 22, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Hashr', juz: 28, verses: 24, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Mumtahina', juz: 28, verses: 13, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'As-Saff', juz: 28, verses: 14, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Al-Jumua', juz: 28, verses: 11, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Al-Munafiqoon', juz: 28, verses: 11, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'At-Taghabun', juz: 28, verses: 18, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'At-Talaq', juz: 28, verses: 12, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'At-Tahrim', juz: 28, verses: 12, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Al-Mulk', juz: 29, verses: 30, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Qalam', juz: 29, verses: 52, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Haaqqa', juz: 29, verses: 52, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Maarij', juz: 29, verses: 44, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Nooh', juz: 29, verses: 28, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Jinn', juz: 29, verses: 28, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Muzzammil', juz: 29, verses: 20, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Muddathir', juz: 29, verses: 56, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Qiyama', juz: 29, verses: 40, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Insan', juz: 29, verses: 31, revelationPlace: 'medina' as const, category: 'medium' as const },
    { name: 'Al-Mursalat', juz: 29, verses: 50, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'An-Naba', juz: 30, verses: 40, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'An-Naziat', juz: 30, verses: 46, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Abasa', juz: 30, verses: 42, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'At-Takwir', juz: 30, verses: 29, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Infitar', juz: 30, verses: 19, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Mutaffifin', juz: 30, verses: 36, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Inshiqaq', juz: 30, verses: 25, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Burooj', juz: 30, verses: 22, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'At-Tariq', juz: 30, verses: 17, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Ala', juz: 30, verses: 19, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Ghashiya', juz: 30, verses: 26, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Fajr', juz: 30, verses: 30, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Al-Balad', juz: 30, verses: 20, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Ash-Shams', juz: 30, verses: 15, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Lail', juz: 30, verses: 21, revelationPlace: 'mecca' as const, category: 'medium' as const },
    { name: 'Ad-Dhuha', juz: 30, verses: 11, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Ash-Sharh', juz: 30, verses: 8, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'At-Tin', juz: 30, verses: 8, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Alaq', juz: 30, verses: 19, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Qadr', juz: 30, verses: 5, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Baiyyina', juz: 30, verses: 8, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Az-Zalzala', juz: 30, verses: 8, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Al-Adiyat', juz: 30, verses: 11, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Qaria', juz: 30, verses: 11, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'At-Takathur', juz: 30, verses: 8, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Asr', juz: 30, verses: 3, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Humaza', juz: 30, verses: 9, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Fil', juz: 30, verses: 5, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Quraish', juz: 30, verses: 4, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Maun', juz: 30, verses: 7, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Kawthar', juz: 30, verses: 3, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Kafirun', juz: 30, verses: 6, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'An-Nasr', juz: 30, verses: 3, revelationPlace: 'medina' as const, category: 'short' as const },
    { name: 'Al-Masadd', juz: 30, verses: 5, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Ikhlas', juz: 30, verses: 4, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'Al-Falaq', juz: 30, verses: 5, revelationPlace: 'mecca' as const, category: 'short' as const },
    { name: 'An-Nas', juz: 30, verses: 6, revelationPlace: 'mecca' as const, category: 'short' as const }
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
      verses: data.verses,
      revelationPlace: data.revelationPlace,
      category: data.category
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
        
        const matchesRevelationPlace = !this.selectedRevelationPlace || 
          surah.revelationPlace === this.selectedRevelationPlace;
        
        const matchesCategory = !this.selectedCategory || 
          surah.category === this.selectedCategory;
        
        const matchesJuz = !this.selectedJuz || 
          surah.juz === +this.selectedJuz;
        
        return matchesSearch && matchesRevelationPlace && matchesCategory && matchesJuz;
      });
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterSurahs();
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.selectedRevelationPlace = '';
    this.selectedCategory = '';
    this.selectedJuz = '';
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