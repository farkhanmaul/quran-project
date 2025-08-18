# Quran App

A modern, responsive web application for reading and studying the Holy Quran, built with Angular.

## Features (Planned)

### 📖 Quran Reading
- [ ] Complete Quran text in Arabic
- [ ] Multiple translations support
- [ ] Transliteration support
- [ ] Beautiful typography for Arabic text
- [ ] Adjustable font sizes and themes
- [ ] Reading progress tracking
- [ ] Bookmarking system

### 🎵 Audio Features
- [ ] Quran recitation with multiple reciters
- [ ] Ayah-by-ayah audio playback
- [ ] Audio player with controls
- [ ] Download for offline listening
- [ ] Playback speed control

### 🕌 Prayer Features
- [ ] Prayer times calculation
- [ ] Qibla direction compass
- [ ] Location-based prayer times
- [ ] Prayer notifications
- [ ] Multiple calculation methods

### 🔍 Search & Navigation
- [ ] Search across Quran text and translations
- [ ] Surah and Ayah navigation
- [ ] Random Ayah feature
- [ ] Advanced filtering options

### ⚙️ Settings & Personalization
- [ ] Dark/Light theme
- [ ] RTL support
- [ ] Multiple language support
- [ ] Personalized settings
- [ ] Export/Import bookmarks

### 📱 Progressive Web App
- [ ] Offline reading capability
- [ ] Push notifications for prayers
- [ ] Install as mobile app
- [ ] Responsive design

## Tech Stack

- **Framework**: Angular 17
- **Language**: TypeScript
- **Styling**: SCSS
- **Build Tool**: Angular CLI
- **Deployment**: GitHub Pages
- **PWA**: Angular Service Worker

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/          # Header, sidebar, footer
│   │   ├── quran/           # Quran reader, surah list
│   │   ├── prayer/          # Prayer times
│   │   ├── qibla/           # Qibla compass
│   │   ├── bookmark/        # Bookmarks management
│   │   └── settings/        # App settings
│   ├── services/            # API and business logic
│   ├── models/              # TypeScript interfaces
│   ├── guards/              # Route guards
│   ├── pipes/               # Custom pipes
│   └── shared/              # Shared utilities
├── assets/
│   ├── fonts/               # Arabic fonts
│   ├── images/              # App images
│   ├── audio/               # Audio files
│   └── data/                # Static data
└── styles/                  # Global styles
```

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation
```bash
# Clone the repository
git clone https://github.com/farkhanmaul/quran-project.git

# Navigate to project directory
cd quran-project/quran-app

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build for GitHub Pages
- `npm test` - Run tests
- `npm run lint` - Run linter

## API Integration

This app uses the [Quran API](https://github.com/fawazahmed0/quran-api) for Quran data and translations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Quran API](https://github.com/fawazahmed0/quran-api) for providing the data
- Islamic community for guidance on proper Quran presentation
- All contributors and maintainers
