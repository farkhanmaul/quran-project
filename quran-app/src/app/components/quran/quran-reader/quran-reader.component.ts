import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ayah {
  number: number;
  text: string;
  translation: string;
  transliteration?: string;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

@Component({
  selector: 'app-quran-reader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quran-reader.component.html',
  styleUrl: './quran-reader.component.scss'
})
export class QuranReaderComponent implements OnInit {
  surah: Surah | null = null;
  loading = true;
  error = '';
  
  // Reader settings
  fontSize = 'medium';
  showTranslation = true;
  showTransliteration = false;
  arabicFont = 'uthmanic';
  
  // Audio
  isPlaying = false;
  currentAyah = 0;
  
  // Navigation
  surahNumber = 1;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.surahNumber = +params['id'] || 1;
      this.loadSurah();
    });
  }

  loadSurah() {
    this.loading = true;
    this.error = '';
    
    // Mock data - in real app, this would come from API
    setTimeout(() => {
      this.surah = this.getMockSurah(this.surahNumber);
      this.loading = false;
    }, 500);
  }

  getMockSurah(number: number): Surah {
    const surahs = [
      {
        number: 1,
        name: 'الفاتحة',
        englishName: 'Al-Fatiha',
        englishNameTranslation: 'The Opening',
        numberOfAyahs: 7,
        revelationType: 'Meccan',
        ayahs: [
          {
            number: 1,
            text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
            transliteration: 'Bismillahi r-rahmani r-raheem'
          },
          {
            number: 2,
            text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            translation: '[All] praise is [due] to Allah, Lord of the worlds -',
            transliteration: 'Alhamdu lillahi rabbi l-alameen'
          },
          {
            number: 3,
            text: 'الرَّحْمَٰنِ الرَّحِيمِ',
            translation: 'The Entirely Merciful, the Especially Merciful,',
            transliteration: 'Ar-rahmani r-raheem'
          },
          {
            number: 4,
            text: 'مَالِكِ يَوْمِ الدِّينِ',
            translation: 'Sovereign of the Day of Recompense.',
            transliteration: 'Maliki yawmi d-deen'
          },
          {
            number: 5,
            text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            translation: 'It is You we worship and You we ask for help.',
            transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'een'
          },
          {
            number: 6,
            text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
            translation: 'Guide us to the straight path -',
            transliteration: 'Ihdina s-sirata l-mustaqeem'
          },
          {
            number: 7,
            text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
            translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
            transliteration: 'Sirata l-ladhina an\'amta alayhim ghayri l-maghdubi alayhim wa la d-dalleen'
          }
        ]
      },
      {
        number: 2,
        name: 'البقرة',
        englishName: 'Al-Baqarah',
        englishNameTranslation: 'The Cow',
        numberOfAyahs: 286,
        revelationType: 'Medinan',
        ayahs: [
          {
            number: 1,
            text: 'الم',
            translation: 'Alif, Lam, Meem.',
            transliteration: 'Alif-lam-meem'
          },
          {
            number: 2,
            text: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
            translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah -',
            transliteration: 'Dhalika l-kitabu la rayba feeh hudan li-l-muttaqeen'
          }
        ]
      }
    ];
    
    return surahs.find(s => s.number === number) || surahs[0];
  }

  // Font size controls
  increaseFontSize() {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(this.fontSize);
    if (currentIndex < sizes.length - 1) {
      this.fontSize = sizes[currentIndex + 1];
    }
  }

  decreaseFontSize() {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(this.fontSize);
    if (currentIndex > 0) {
      this.fontSize = sizes[currentIndex - 1];
    }
  }

  // Navigation
  previousSurah() {
    if (this.surahNumber > 1) {
      this.router.navigate(['/quran/surah', this.surahNumber - 1]);
    }
  }

  nextSurah() {
    if (this.surahNumber < 114) {
      this.router.navigate(['/quran/surah', this.surahNumber + 1]);
    }
  }

  // Audio controls
  toggleAudio() {
    this.isPlaying = !this.isPlaying;
    // Implement audio functionality
  }

  // Display options
  toggleTranslation() {
    this.showTranslation = !this.showTranslation;
  }

  toggleTransliteration() {
    this.showTransliteration = !this.showTransliteration;
  }

  changeArabicFont(font: string) {
    this.arabicFont = font;
  }

  // Bookmark functionality
  bookmarkAyah(ayahNumber: number) {
    // Implement bookmark functionality
    console.log(`Bookmarked Surah ${this.surahNumber}, Ayah ${ayahNumber}`);
  }

  // Share functionality
  shareAyah(ayahNumber: number) {
    if (navigator.share && this.surah) {
      const ayah = this.surah.ayahs.find(a => a.number === ayahNumber);
      if (ayah) {
        navigator.share({
          title: `${this.surah.englishName} ${ayahNumber}`,
          text: `${ayah.text}\n\n${ayah.translation}`,
          url: window.location.href
        });
      }
    }
  }
}