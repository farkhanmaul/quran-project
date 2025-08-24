import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface BookmarkedVerse {
  chapter: number;
  verse: number;
  text: string;
  translation?: string;
  surahName?: string;
  timestamp: number;
}

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-top">
          <h1>My Bookmarks</h1>
          <p>Your saved verses for easy access</p>
        </div>
      </header>
      
      <div class="navigation">
        <a routerLink="/" class="back-btn">← Back to Home</a>
        <div class="bookmark-actions" *ngIf="bookmarkedVerses.length > 0">
          <button (click)="exportBookmarks()" class="action-btn">📤 Export</button>
          <button (click)="clearAllBookmarks()" class="action-btn danger">🗑️ Clear All</button>
        </div>
      </div>
      
      <div *ngIf="bookmarkedVerses.length === 0" class="empty-state">
        <div class="empty-icon">📖</div>
        <h2>No bookmarks yet</h2>
        <p>Start reading and bookmark your favorite verses!</p>
        <a routerLink="/" class="browse-btn">Browse Quran</a>
      </div>
      
      <div *ngIf="bookmarkedVerses.length > 0" class="bookmarks-list">
        <div class="bookmarks-header">
          <h3>{{ bookmarkedVerses.length }} Bookmarked Verse{{ bookmarkedVerses.length !== 1 ? 's' : '' }}</h3>
          <div class="sort-options">
            <label>Sort by:</label>
            <select [(ngModel)]="sortBy" (change)="sortBookmarks()" class="sort-select">
              <option value="timestamp">Date Added</option>
              <option value="chapter">Surah Order</option>
            </select>
          </div>
        </div>
        
        <div *ngFor="let bookmark of sortedBookmarks; let i = index" class="bookmark-card">
          <div class="bookmark-header">
            <div class="bookmark-reference">
              <a [routerLink]="['/surah', bookmark.chapter]" class="surah-link">
                {{ bookmark.surahName || 'Surah ' + bookmark.chapter }} {{ bookmark.chapter }}:{{ bookmark.verse }}
              </a>
            </div>
            <div class="bookmark-actions-small">
              <button (click)="removeBookmark(i)" class="remove-btn" title="Remove bookmark">🗑️</button>
            </div>
          </div>
          <div class="bookmark-content">
            <div class="verse-text arabic">{{ bookmark.text }}</div>
            <div *ngIf="bookmark.translation" class="verse-text indonesian">{{ bookmark.translation }}</div>
          </div>
          <div class="bookmark-meta">
            <span class="bookmark-date">Added: {{ formatDate(bookmark.timestamp) }}</span>
          </div>
        </div>
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
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 4rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #fafafa;
      color: #2c3e50;
    }
    
    .header {
      margin-bottom: 3rem;
      padding: 2rem 0;
      border-bottom: 1px solid #e8e9ea;
    }
    
    .header-top {
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #1a202c;
      font-weight: 300;
      font-family: 'Georgia', 'Times', serif;
      letter-spacing: -0.5px;
    }
    
    .header p {
      color: #4a5568;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .navigation {
      margin-bottom: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #4a5568;
      text-decoration: none;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      transition: all 0.2s ease;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .back-btn:hover {
      background: #f7fafc;
      border-color: #a0aec0;
    }
    
    .bookmark-actions {
      display: flex;
      gap: 1rem;
    }
    
    .action-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .action-btn:hover {
      border-color: #a0aec0;
    }
    
    .action-btn.danger {
      color: #dc2626;
      border-color: #dc2626;
    }
    
    .action-btn.danger:hover {
      background: #dc2626;
      color: white;
    }
    
    .empty-state {
      text-align: center;
      padding: 6rem 2rem;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 2rem;
    }
    
    .empty-state h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #1a202c;
    }
    
    .empty-state p {
      color: #4a5568;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    
    .browse-btn {
      display: inline-block;
      padding: 1rem 2rem;
      background: #2d3748;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .browse-btn:hover {
      background: #1a202c;
    }
    
    .bookmarks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .bookmarks-header h3 {
      color: #1a202c;
      margin: 0;
    }
    
    .sort-options {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .sort-options label {
      color: #4a5568;
      font-size: 0.9rem;
    }
    
    .sort-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      color: #4a5568;
    }
    
    .bookmarks-list {
      flex: 1;
    }
    
    .bookmark-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    
    .bookmark-card:hover {
      border-color: #cbd5e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .bookmark-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .surah-link {
      color: #2d3748;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .surah-link:hover {
      color: #1a202c;
    }
    
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      opacity: 0.7;
      transition: all 0.2s ease;
    }
    
    .remove-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .verse-text {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    
    .verse-text.arabic {
      direction: rtl;
      text-align: right;
      font-family: 'Amiri', 'Times New Roman', serif;
      font-size: 1.2rem;
      color: #1a202c;
      margin-bottom: 1.5rem;
    }
    
    .verse-text.indonesian {
      color: #4a5568;
      font-style: italic;
      padding-top: 1rem;
      border-top: 1px solid #f7fafc;
    }
    
    .bookmark-meta {
      font-size: 0.9rem;
      color: #718096;
      border-top: 1px solid #f7fafc;
      padding-top: 1rem;
    }
    
    .footer {
      margin-top: 3rem;
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
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .navigation {
        flex-direction: column;
        align-items: stretch;
      }
      
      .bookmarks-header {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class BookmarksComponent implements OnInit {
  bookmarkedVerses: BookmarkedVerse[] = [];
  sortBy: 'timestamp' | 'chapter' = 'timestamp';
  sortedBookmarks: BookmarkedVerse[] = [];

  ngOnInit() {
    this.loadBookmarks();
    this.sortBookmarks();
  }

  loadBookmarks() {
    const bookmarks = localStorage.getItem('quran-bookmarks');
    if (bookmarks) {
      this.bookmarkedVerses = JSON.parse(bookmarks);
    }
  }

  sortBookmarks() {
    this.sortedBookmarks = [...this.bookmarkedVerses].sort((a, b) => {
      if (this.sortBy === 'timestamp') {
        return b.timestamp - a.timestamp; // Latest first
      } else {
        // Sort by chapter then verse
        if (a.chapter !== b.chapter) {
          return a.chapter - b.chapter;
        }
        return a.verse - b.verse;
      }
    });
  }

  removeBookmark(index: number) {
    if (confirm('Remove this bookmark?')) {
      this.sortedBookmarks.splice(index, 1);
      this.bookmarkedVerses = [...this.sortedBookmarks];
      this.saveBookmarks();
    }
  }

  clearAllBookmarks() {
    if (confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      this.bookmarkedVerses = [];
      this.sortedBookmarks = [];
      this.saveBookmarks();
    }
  }

  exportBookmarks() {
    const dataStr = JSON.stringify(this.bookmarkedVerses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quran-bookmarks.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  private saveBookmarks() {
    localStorage.setItem('quran-bookmarks', JSON.stringify(this.bookmarkedVerses));
  }
}