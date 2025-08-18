import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  
  searchQuery: string = '';
  isDarkMode: boolean = false;
  currentLanguage: string = 'en';
  
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'id', name: 'Bahasa Indonesia' }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    // TODO: Implement theme switching
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  changeLanguage(langCode: string) {
    this.currentLanguage = langCode;
    // TODO: Implement language switching
    console.log('Language changed to:', langCode);
  }
}