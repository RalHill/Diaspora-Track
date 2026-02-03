import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'diaspora-track-theme';
  
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Load theme from localStorage on init
    this.loadTheme();
    
    // Apply theme changes to document body
    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    });
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme if available, otherwise use system preference
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.isDarkMode.set(isDark);
  }

  toggle(): void {
    this.isDarkMode.update(current => !current);
  }

  setDark(): void {
    this.isDarkMode.set(true);
  }

  setLight(): void {
    this.isDarkMode.set(false);
  }
}
