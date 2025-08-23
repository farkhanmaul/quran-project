import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  hijriDate: string = '';
  
  // Sample data for development
  nextPrayer = {
    name: 'Maghrib',
    time: '18:45',
    timeRemaining: '2h 15m'
  };
  
  ayahOfDay = {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah - He will make for him a way out.',
    reference: 'At-Talaq 65:2'
  };
  
  readingProgress = {
    percentage: 23,
    lastRead: 'Surah Al-Baqarah, Ayah 156',
    totalPages: 604,
    pagesRead: 139
  };
  
  quickNavItems = [
    { title: 'Read Quran', icon: '📖', route: '/quran', description: 'Continue reading' },
    { title: 'Prayer Times', icon: '🕌', route: '/prayer-times', description: 'Today\'s schedule' },
    { title: 'Qibla', icon: '🧭', route: '/qibla', description: 'Find direction' },
    { title: 'Bookmarks', icon: '🔖', route: '/bookmarks', description: 'Saved verses' },
    { title: 'Settings', icon: '⚙️', route: '/settings', description: 'Preferences' }
  ];

  ngOnInit() {
    this.updateCurrentDate();
  }
  
  private updateCurrentDate() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Simple Hijri date approximation
    this.hijriDate = this.getHijriDate(now);
  }
  
  private getHijriDate(gregorianDate: Date): string {
    // Simple approximation - in real app would use proper Hijri calendar library
    const hijriYear = gregorianDate.getFullYear() - 579;
    const months = ['Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 
                   'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban', 
                   'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    return `${gregorianDate.getDate()} ${months[gregorianDate.getMonth()]} ${hijriYear} AH`;
  }
}