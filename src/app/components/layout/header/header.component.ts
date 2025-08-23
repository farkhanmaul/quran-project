import { Component, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() themeChange = new EventEmitter<boolean>();
  @Output() languageChange = new EventEmitter<string>();
  
  searchQuery: string = '';
  isDarkMode: boolean = false;
  currentLanguage: string = 'en';
  isMenuOpen: boolean = false;
  
  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Load saved theme preference
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // Load saved language preference
      const savedLanguage = localStorage.getItem('language');
      this.currentLanguage = savedLanguage || 'en';
      
      // Apply initial theme
      this.applyTheme();
      
      // Apply initial language
      this.applyLanguage();
    }
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.themeChange.emit(this.isDarkMode);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      if (this.isDarkMode) {
        htmlElement.classList.add('dark-mode');
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.classList.remove('dark-mode');
        htmlElement.setAttribute('data-theme', 'light');
      }
    }
  }

  changeLanguage(langCode: string) {
    this.currentLanguage = langCode;
    this.applyLanguage();
    this.languageChange.emit(langCode);
    this.isMenuOpen = false;
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', langCode);
    }
  }

  private applyLanguage() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('lang', this.currentLanguage);
      
      // Set RTL direction for Arabic
      if (this.currentLanguage === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
      }
    }
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.currentLanguage);
    return lang ? lang.name : 'English';
  }

  getCurrentLanguageFlag(): string {
    const lang = this.languages.find(l => l.code === this.currentLanguage);
    return lang ? lang.flag : '🇺🇸';
  }
}