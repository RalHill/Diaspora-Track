import { Injectable, signal } from '@angular/core';

interface RateCache {
  [key: string]: { rate: number; timestamp: number };
}

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  private cache: RateCache = {};
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  loading = signal(false);
  error = signal<string | null>(null);

  async getRate(source: string, target: string): Promise<number | null> {
    const cacheKey = `${source}_${target}`;
    const cached = this.cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.rate;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await fetch(`/api/rate?source=${source}&target=${target}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch rate');
      }

      const data = await response.json();
      const rate = data.conversion_rate;

      this.cache[cacheKey] = { rate, timestamp: Date.now() };
      this.loading.set(false);
      return rate;
    } catch (err: any) {
      this.error.set(err.message);
      this.loading.set(false);
      return null;
    }
  }
}
