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

  // Mock rates for development (fallback when API unavailable)
  private mockRates: { [key: string]: { [key: string]: number } } = {
    'USD': {
      'NGN': 1423.50,
      'GHS': 13.50,
      'KES': 130.00,
      'INR': 83.00,
      'PHP': 58.00
    },
    'CAD': {
      'NGN': 1050.00,
      'GHS': 9.90,
      'KES': 95.00,
      'INR': 61.00,
      'PHP': 42.00
    },
    'GBP': {
      'NGN': 1800.00,
      'GHS': 17.00,
      'KES': 165.00,
      'INR': 105.00,
      'PHP': 73.00
    },
    'EUR': {
      'NGN': 1550.00,
      'GHS': 14.70,
      'KES': 142.00,
      'INR': 90.00,
      'PHP': 62.00
    }
  };

  async getRate(source: string, target: string): Promise<number | null> {
    const cacheKey = `${source}_${target}`;
    const cached = this.cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.rate;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      // Call ExchangeRate-API directly with your API key
      const API_KEY = 'bcba54362e2a16ef46c79dff';
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${source}/${target}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result === 'error') {
        throw new Error(data['error-type'] || 'Invalid currency pair');
      }
      
      const rate = data.conversion_rate;

      if (rate) {
        this.cache[cacheKey] = { rate, timestamp: Date.now() };
        this.loading.set(false);
        return rate;
      }
      
      throw new Error('No rate returned from API');
    } catch (err: any) {
      console.error('Exchange rate API error:', err);
      this.error.set(err.message);
      
      // Fallback to mock rates if API fails
      const mockRate = this.mockRates[source]?.[target];
      if (mockRate) {
        console.log('Using fallback mock rate');
        this.cache[cacheKey] = { rate: mockRate, timestamp: Date.now() };
        this.loading.set(false);
        return mockRate;
      }
      
      this.loading.set(false);
      return null;
    }
  }
}
