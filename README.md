# 📖 Quran App - Digital Quran Reader

![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-1.79.1-pink?logo=sass)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green)
![Build Status](https://img.shields.io/github/actions/workflow/status/farkhanmaul/quran-project/deploy.yml?branch=main)

A modern, responsive web application for reading and studying the Holy Quran. Built with Angular 17, featuring beautiful Islamic design, multiple language support, and comprehensive reading tools.

## 🌟 Live Demo

**[Visit Quran App →](https://farkhanmaul.github.io/quran-project/)**

## ✨ Features

### 📱 **Core Functionality**
- **Complete Quran Reader** - All 114 Surahs with Arabic text, translations, and transliterations
- **Multi-language Support** - English, Arabic (العربية), and Indonesian (Bahasa Indonesia)
- **RTL Text Support** - Proper right-to-left layout for Arabic content
- **Progressive Web App (PWA)** - Install on mobile devices and desktop

### 🎨 **User Experience**
- **Dark & Light Themes** - Beautiful gradient designs with smooth transitions
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **Touch-friendly Interface** - Optimized for mobile interactions
- **Accessibility Support** - ARIA labels, keyboard navigation, focus management

### 📖 **Reading Experience**
- **Customizable Text Size** - 4 font size options for comfortable reading
- **Arabic Font Options** - Uthmanic Hafs and Indo-Pak script styles
- **Reading Preferences** - Toggle translation and transliteration display
- **Navigation Controls** - Easy surah-to-surah navigation with progress tracking
- **Search & Filter** - Find surahs by name, revelation type (Meccan/Medinan)

### ⚙️ **Advanced Settings**
- **Theme Management** - Light, Dark, or Auto (system preference)
- **Language Switching** - Persistent language settings with proper RTL support
- **Reading Customization** - Font sizes, Arabic fonts, display preferences
- **Data Management** - Export/import settings, reset to defaults
- **Notification Settings** - Reading reminders and prayer time notifications (UI ready)

### 🔊 **Audio Features (UI Ready)**
- **Audio Controls** - Play/pause buttons and auto-play settings
- **Audio Player Interface** - Ready for integration with Quran recitation APIs

## 🛠️ Technology Stack

### **Frontend Framework**
- **Angular 17** - Latest Angular with standalone components
- **TypeScript 5.0** - Type-safe development
- **SCSS** - Advanced styling with CSS variables
- **RxJS** - Reactive programming for data handling

### **Design & Styling**
- **CSS Variables** - Consistent theming system
- **CSS Grid & Flexbox** - Modern responsive layouts
- **Custom Animations** - Smooth transitions and hover effects
- **Islamic Design Language** - Beautiful gradients and Arabic typography

### **Development Tools**
- **Angular CLI 17** - Modern build tools and development server
- **ESLint & Prettier** - Code quality and formatting
- **Git Hooks** - Pre-commit quality checks

### **Deployment**
- **GitHub Actions** - Automated CI/CD pipeline
- **GitHub Pages** - Free hosting with custom domain support
- **PWA Manifest** - Progressive web app capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farkhanmaul/quran-project.git
   cd quran-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

### Build for Production

```bash
# Build for production
npm run build

# Build for GitHub Pages deployment
npm run build:gh-pages

# Serve production build locally
npm run serve:dist
```

## 📁 Project Structure

```
quran-project/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/           # Home dashboard with Islamic widgets
│   │   │   ├── layout/
│   │   │   │   ├── header/          # Navigation with theme & language controls
│   │   │   │   └── sidebar/         # Navigation sidebar (ready)
│   │   │   ├── quran/
│   │   │   │   ├── surah-list/      # Browse all surahs with search
│   │   │   │   └── quran-reader/    # Full Quran reading interface
│   │   │   ├── settings/            # Comprehensive settings page
│   │   │   ├── prayer/              # Prayer times (ready for implementation)
│   │   │   ├── qibla/               # Qibla compass (ready)
│   │   │   └── bookmark/            # Bookmarks system (ready)
│   │   ├── services/                # Data services for Quran, prayers, etc.
│   │   ├── models/                  # TypeScript interfaces and types
│   │   ├── guards/                  # Route guards
│   │   └── shared/                  # Shared components and utilities
│   ├── assets/                      # Static assets (images, icons, data)
│   ├── styles.scss                  # Global styles with CSS variables
│   ├── manifest.json               # PWA manifest
│   └── index.html                  # Main HTML with proper meta tags
├── .github/workflows/              # GitHub Actions CI/CD
├── docs/                          # API documentation
├── angular.json                   # Angular workspace config
├── package.json                   # Project dependencies and scripts
└── README.md                     # This file
```

## 🎯 Key Components

### **Dashboard Component**
- Islamic greeting and current date display
- Prayer times widget (sample data)
- Ayah of the day with Arabic text and translation
- Reading progress tracker
- Quick navigation to Quran sections

### **Quran Reader Component**
- Full surah display with Arabic text, translation, and transliteration
- Customizable font sizes and Arabic font styles
- Audio controls interface (ready for API integration)
- Bookmark and share functionality
- Navigation between surahs with progress indicator

### **Settings Component**
- Theme management (Light/Dark/Auto)
- Language selection with RTL support
- Reading preferences and display options
- Audio settings and notification preferences
- Data export/import and reset functionality

### **Header Component**
- Responsive navigation with mobile menu
- Search functionality (ready for implementation)
- Theme toggle with persistent storage
- Language switcher with flag indicators
- Settings access

## 🌍 Internationalization

### **Supported Languages**
- **English (EN)** - Default interface language
- **Arabic (العربية)** - RTL layout with Arabic interface
- **Indonesian (ID)** - Bahasa Indonesia interface

### **RTL Support**
- Proper right-to-left text direction for Arabic
- Mirrored layouts and navigation elements
- Arabic typography with appropriate font rendering
- Cultural considerations for Islamic content

## 🎨 Design System

### **Color Palette**
- **Primary Gradient**: Purple to blue (#667eea → #764ba2)
- **Light Theme**: Clean whites with subtle grays
- **Dark Theme**: Deep blacks with purple accents
- **Semantic Colors**: Success, warning, and error states

### **Typography**
- **Interface Font**: Inter (Google Fonts)
- **Arabic Font**: Amiri for Uthmanic Hafs script
- **Font Sizes**: Responsive scaling with CSS custom properties
- **Line Heights**: Optimized for readability in both LTR and RTL

### **Components**
- **Consistent spacing** using CSS custom properties
- **Smooth animations** with reduced motion support
- **Accessible focus states** for keyboard navigation
- **Mobile-first responsive design**

## 📱 Progressive Web App Features

### **PWA Capabilities**
- **Installable** on mobile devices and desktop
- **Offline-ready structure** (ready for service worker implementation)
- **Custom app icons** in multiple sizes
- **Theme color** matching app design
- **Launch screen** configuration

### **Manifest Configuration**
```json
{
  "name": "Quran App - Digital Quran Reader",
  "short_name": "Quran App",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/"
}
```

## 🔧 Development Scripts

```bash
# Development
npm start              # Start development server
npm run serve         # Alternative start command
npm run build         # Production build
npm run build:gh-pages # Build for GitHub Pages
npm run watch         # Development build with file watching

# Testing (ready for implementation)
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run e2e          # Run end-to-end tests

# Code Quality
npm run lint         # ESLint code checking
npm run format       # Prettier code formatting
npm run analyze      # Bundle analysis
```

## 🚀 Deployment

### **GitHub Pages (Current)**
Automatically deployed via GitHub Actions on every push to `main` branch.

**Live URL**: [https://farkhanmaul.github.io/quran-project/](https://farkhanmaul.github.io/quran-project/)

### **Custom Domain Setup**
1. Add `CNAME` file to `src/assets/`
2. Configure custom domain in repository settings
3. Update `--base-href` in build scripts

### **Other Hosting Options**
- **Netlify**: Drag & drop `dist` folder
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: Use Firebase CLI
- **AWS S3**: Static website hosting

## 🔮 Roadmap & Future Features

### **Phase 1: API Integration** ✅ COMPLETED
- [x] Real Quran API integration (fawazahmed0/quran-api)
- [x] Multiple navigation modes (Surah, Juz, Ruku, Pages, Manzil, Maqra)
- [x] Advanced filtering by metadata (revelation place, verse count, Juz)
- [x] Sajda verse marking with visual indicators

### **Phase 2: Enhanced Features** ✅ COMPLETED
- [x] Bookmarking system with export/import
- [x] Advanced search with content highlighting
- [x] Diacritical marks toggle
- [x] Night/Day reading modes with persistence
- [x] Progressive Web App with offline support

### **Phase 3: Community Features**
- [ ] User accounts and profiles
- [ ] Reading statistics and goals
- [ ] Community sharing features
- [ ] Multi-language translations

### **Phase 4: Mobile Apps**
- [ ] Capacitor integration for iOS/Android
- [ ] Native mobile features
- [ ] Offline content download
- [ ] Push notifications

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/CONTRIBUTING.md) for details.

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Quran API Sources** - Thanks to open-source Quran data providers
- **Islamic Design Inspiration** - Traditional Islamic art and calligraphy
- **Font Providers** - Google Fonts for Inter and Amiri fonts
- **Angular Community** - For excellent documentation and tools
- **Open Source Contributors** - Everyone who helps improve this project

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/farkhanmaul/quran-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/farkhanmaul/quran-project/discussions)
- **Email**: [farkhanmaul@example.com](mailto:farkhanmaul@example.com)

## 📊 Project Stats

![GitHub Repo Size](https://img.shields.io/github/repo-size/farkhanmaul/quran-project)
![GitHub Last Commit](https://img.shields.io/github/last-commit/farkhanmaul/quran-project)
![GitHub Issues](https://img.shields.io/github/issues/farkhanmaul/quran-project)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/farkhanmaul/quran-project)

---

<div align="center">

**Made with ❤️ for the Muslim community**

**باِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ**

*"In the name of Allah, the Most Gracious, the Most Merciful"*

</div>