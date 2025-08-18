import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

@Component({
  selector: 'app-surah-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './surah-list.component.html',
  styleUrl: './surah-list.component.scss'
})
export class SurahListComponent implements OnInit {
  surahs: Surah[] = [];
  filteredSurahs: Surah[] = [];
  searchQuery: string = '';
  selectedFilter: string = 'all';
  isLoading: boolean = true;

  // Sample data - in real app would come from API
  private sampleSurahs: Surah[] = [
    { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
    { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
    { number: 3, name: 'آل عمران', englishName: 'Ali Imran', englishNameTranslation: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan' },
    { number: 4, name: 'النساء', englishName: 'An-Nisa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
    { number: 5, name: 'المائدة', englishName: 'Al-Maidah', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan' },
    { number: 6, name: 'الأنعام', englishName: 'Al-Anam', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan' },
    { number: 7, name: 'الأعراف', englishName: 'Al-Araf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan' },
    { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan' },
    { number: 9, name: 'التوبة', englishName: 'At-Tawbah', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan' },
    { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan' }
  ];

  ngOnInit() {
    this.loadSurahs();
  }

  loadSurahs() {
    // Simulate API call
    setTimeout(() => {
      this.surahs = this.sampleSurahs;
      this.filteredSurahs = [...this.surahs];
      this.isLoading = false;
    }, 1000);
  }

  onSearch() {
    this.filterSurahs();
  }

  onFilterChange() {
    this.filterSurahs();
  }

  private filterSurahs() {
    let filtered = [...this.surahs];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(surah => 
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
      );
    }

    // Apply revelation type filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(surah => 
        surah.revelationType.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }

    this.filteredSurahs = filtered;
  }
}