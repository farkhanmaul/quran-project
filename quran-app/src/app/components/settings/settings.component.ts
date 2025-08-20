import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  arabicFont: 'uthmanic' | 'indopak';
  showTranslation: boolean;
  showTransliteration: boolean;
  autoplay: boolean;
  notifications: boolean;
  readingReminders: boolean;
  prayerTimeNotifications: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settings: SettingsData = {
    theme: 'auto',
    language: 'en',
    fontSize: 'medium',
    arabicFont: 'uthmanic',
    showTranslation: true,
    showTransliteration: false,
    autoplay: false,
    notifications: true,
    readingReminders: true,
    prayerTimeNotifications: true
  };

  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
  ];

  themes = [
    { value: 'light', name: 'Light', icon: '☀️' },
    { value: 'dark', name: 'Dark', icon: '🌙' },
    { value: 'auto', name: 'Auto', icon: '🔄' }
  ];

  fontSizes = [
    { value: 'small', name: 'Small', size: '14px' },
    { value: 'medium', name: 'Medium', size: '18px' },
    { value: 'large', name: 'Large', size: '22px' },
    { value: 'extra-large', name: 'Extra Large', size: '26px' }
  ];

  arabicFonts = [
    { value: 'uthmanic', name: 'Uthmanic Hafs', preview: 'بِسْمِ اللَّهِ' },
    { value: 'indopak', name: 'Indo-Pak', preview: 'بِسْمِ اللَّهِ' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    if (isPlatformBrowser(this.platformId)) {
      const savedSettings = localStorage.getItem('quran-app-settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } else {
        // Load individual settings from previous implementation
        this.settings.theme = (localStorage.getItem('theme') as any) || 'auto';
        this.settings.language = localStorage.getItem('language') || 'en';
      }
    }
  }

  saveSettings() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('quran-app-settings', JSON.stringify(this.settings));
      this.applySettings();
    }
  }

  private applySettings() {
    if (isPlatformBrowser(this.platformId)) {
      // Apply theme
      this.applyTheme();
      
      // Apply language
      this.applyLanguage();
      
      // Apply font settings
      document.documentElement.style.setProperty('--arabic-font-size', this.getFontSize());
      
      // Apply Arabic font
      document.documentElement.classList.remove('arabic-uthmanic', 'arabic-indopak');
      document.documentElement.classList.add(`arabic-${this.settings.arabicFont}`);
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      
      if (this.settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.settings.theme = prefersDark ? 'dark' : 'light';
      }
      
      if (this.settings.theme === 'dark') {
        htmlElement.classList.add('dark-mode');
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.classList.remove('dark-mode');
        htmlElement.setAttribute('data-theme', 'light');
      }
    }
  }

  private applyLanguage() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('lang', this.settings.language);
      
      if (this.settings.language === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
      }
    }
  }

  private getFontSize(): string {
    const sizeMap = {
      'small': '1.4rem',
      'medium': '1.8rem',
      'large': '2.2rem',
      'extra-large': '2.6rem'
    };
    return sizeMap[this.settings.fontSize];
  }

  onThemeChange(theme: 'light' | 'dark' | 'auto') {
    this.settings.theme = theme;
    this.saveSettings();
  }

  onLanguageChange(language: string) {
    this.settings.language = language;
    this.saveSettings();
  }

  onFontSizeChange(fontSize: 'small' | 'medium' | 'large' | 'extra-large') {
    this.settings.fontSize = fontSize;
    this.saveSettings();
  }

  onArabicFontChange(font: 'uthmanic' | 'indopak') {
    this.settings.arabicFont = font;
    this.saveSettings();
  }

  onToggleChange(setting: keyof SettingsData) {
    this.saveSettings();
  }

  resetSettings() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('quran-app-settings');
      localStorage.removeItem('theme');
      localStorage.removeItem('language');
      
      this.settings = {
        theme: 'auto',
        language: 'en',
        fontSize: 'medium',
        arabicFont: 'uthmanic',
        showTranslation: true,
        showTransliteration: false,
        autoplay: false,
        notifications: true,
        readingReminders: true,
        prayerTimeNotifications: true
      };
      
      this.applySettings();
    }
  }

  exportSettings() {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quran-app-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importSettings(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      try {
        const file = input.files[0];
        const text = await file.text();
        const importedSettings = JSON.parse(text);
        
        // Validate imported settings
        if (this.validateSettings(importedSettings)) {
          this.settings = { ...this.settings, ...importedSettings };
          this.saveSettings();
          alert('Settings imported successfully!');
        } else {
          alert('Invalid settings file format.');
        }
      } catch (error) {
        alert('Error importing settings. Please check the file format.');
      }
    }
  }

  private validateSettings(settings: any): boolean {
    const requiredKeys = ['theme', 'language', 'fontSize', 'arabicFont'];
    return requiredKeys.every(key => key in settings);
  }
}