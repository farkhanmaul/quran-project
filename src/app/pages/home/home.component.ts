import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Surah {
  chapter: number;
  name: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header class="header">
        <h1>Al-Quran</h1>
        <p>Choose a surah to read</p>
      </header>
      
      <div class="surah-list">
        <a 
          *ngFor="let surah of surahs" 
          [routerLink]="['/surah', surah.chapter]"
          class="surah-card">
          <span class="surah-number">{{ surah.chapter }}</span>
          <span class="surah-name">{{ surah.name }}</span>
        </a>
      </div>
      
      <div *ngIf="loading" class="loading">Loading...</div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .header p {
      color: #666;
      font-size: 1.1rem;
    }
    
    .surah-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .surah-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      transition: background-color 0.2s;
    }
    
    .surah-card:hover {
      background: #e9ecef;
    }
    
    .surah-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #333;
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .surah-name {
      font-weight: 500;
    }
    
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .surah-list {
        grid-template-columns: 1fr;
      }
      
      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  surahs: Surah[] = [];
  loading = true;

  // Simple static data for 114 surahs
  private surahNames = [
    'Al-Fatiha', 'Al-Baqarah', 'Aal-E-Imran', 'An-Nisa', 'Al-Maidah',
    'Al-Anam', 'Al-Araf', 'Al-Anfal', 'At-Tawbah', 'Yunus',
    'Hud', 'Yusuf', 'Ar-Rad', 'Ibrahim', 'Al-Hijr',
    'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
    'Al-Anbiya', 'Al-Hajj', 'Al-Mumenoon', 'An-Noor', 'Al-Furqan',
    'Ash-Shuara', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Room',
    'Luqman', 'As-Sajda', 'Al-Ahzab', 'Saba', 'Fatir',
    'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
    'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiya',
    'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujraat', 'Qaf',
    'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
    'Al-Waqia', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahina',
    'As-Saff', 'Al-Jumua', 'Al-Munafiqoon', 'At-Taghabun', 'At-Talaq',
    'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haaqqa', 'Al-Maarij',
    'Nooh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddathir', 'Al-Qiyama',
    'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Naziat', 'Abasa',
    'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Burooj',
    'At-Tariq', 'Al-Ala', 'Al-Ghashiya', 'Al-Fajr', 'Al-Balad',
    'Ash-Shams', 'Al-Lail', 'Ad-Dhuha', 'Ash-Sharh', 'At-Tin',
    'Al-Alaq', 'Al-Qadr', 'Al-Baiyyina', 'Az-Zalzala', 'Al-Adiyat',
    'Al-Qaria', 'At-Takathur', 'Al-Asr', 'Al-Humaza', 'Al-Fil',
    'Quraish', 'Al-Maun', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
    'Al-Masadd', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSurahs();
  }

  loadSurahs() {
    // Create simple surah list
    this.surahs = this.surahNames.map((name, index) => ({
      chapter: index + 1,
      name: name
    }));
    this.loading = false;
  }
}