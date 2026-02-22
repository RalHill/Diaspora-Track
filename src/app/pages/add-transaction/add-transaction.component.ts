import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { RatesService } from '../../services/rates.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Mobile Header -->
      <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1e3a8a] dark:bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <button (click)="router.navigate(['/dashboard'])" class="p-2 hover:bg-blue-800 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-lg font-bold flex-1 text-center">Log Remittance</h1>
        <button (click)="toggleMobileMenu()" class="p-2 hover:bg-blue-800 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (mobileMenuOpen()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            }
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden fixed inset-0 z-40 bg-black/50" (click)="toggleMobileMenu()"></div>
      }

      <!-- Sidebar -->
      <aside [ngClass]="{
        'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e3a8a] dark:bg-gray-800 text-white flex flex-col': true,
        'transform transition-transform duration-300 lg:transform-none': true,
        'translate-x-0': mobileMenuOpen(),
        '-translate-x-full lg:translate-x-0': !mobileMenuOpen()
      }">
        <div class="p-6 flex items-center space-x-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v2H9V5zm0 4h2v6H9V9z"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold">DiaspoTrack</h1>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <a routerLink="/dashboard" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/expenses" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">Expenses</span>
          </a>
          <a routerLink="/add-transaction" routerLinkActive="bg-orange-500" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <span class="font-medium">Remittances</span>
          </a>
          <a routerLink="/reports" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="font-medium">Reports</span>
          </a>
          <a routerLink="/alerts" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="font-medium">Alerts</span>
          </a>
          <a routerLink="/settings" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="font-medium">Settings</span>
          </a>
        </nav>

        <div class="p-4 border-t border-blue-700">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ authService.user()?.email?.split('@')[0] || 'User' }}</p>
              <p class="text-xs text-blue-300 truncate">{{ authService.user()?.email }}</p>
            </div>
          </div>
          <button (click)="authService.signOut()" 
                  class="flex items-center space-x-2 text-sm text-blue-200 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto lg:ml-0 pt-14 lg:pt-0">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button (click)="router.navigate(['/dashboard'])" 
                    class="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Log Remittance</h2>
          </div>
          <div class="flex items-center space-x-2 lg:space-x-4">
            <button (click)="themeService.toggle()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              @if (themeService.isDarkMode()) {
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              }
            </button>
          </div>
        </header>

        <!-- Form Content -->
        <div class="p-4 lg:p-8">
          <div class="max-w-3xl mx-auto">

          @if (error()) {
            <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-4">
              {{ error() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Provider -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Provider</label>
              <select formControlName="provider" 
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Select provider</option>
              <option value="Western Union">Western Union</option>
              <option value="Remitly">Remitly</option>
              <option value="MoneyGram">MoneyGram</option>
              <option value="Wise">Wise</option>
              <option value="WorldRemit">WorldRemit</option>
              <option value="Other">Other</option>
            </select>
            </div>

            <!-- Amount Sent -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Amount Sent</label>
              <input type="number" step="0.01" formControlName="amount_sent"
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                     placeholder="0.00">
            </div>

            <!-- Currency Sent -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Currency Sent</label>
              <select formControlName="currency_sent"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <!-- Target Currency -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Target Currency</label>
              <select formControlName="target_currency"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="GHS">GHS - Ghanaian Cedi</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="PHP">PHP - Philippine Peso</option>
              </select>
            </div>

            <!-- Exchange Rate & Get Live Rate Button -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Exchange Rate</label>
                <button type="button" (click)="getLiveRate()"
                        [disabled]="ratesService.loading()"
                        class="text-sm text-primary-600 dark:text-primary-400 font-semibold disabled:opacity-50 min-h-[44px] px-3">
                  @if (ratesService.loading()) {
                    Getting rate...
                  } @else {
                    Get Live Rate
                  }
                </button>
              </div>
              <input type="number" step="0.000001" formControlName="exchange_rate"
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                     placeholder="0.00">
              @if (marketRate()) {
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Market rate: {{ marketRate() | number:'1.6-6' }}
                </p>
              }
            </div>

            <!-- Fee Amount -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Fee Amount</label>
              <input type="number" step="0.01" formControlName="fee_amount"
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                     placeholder="0.00">
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Category</label>
              <select formControlName="category"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Family Support">Family Support</option>
                <option value="Education">Education</option>
                <option value="Medical">Medical</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Recipient Country -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Recipient Country</label>
              <input type="text" formControlName="recipient_country"
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                     placeholder="e.g., Nigeria">
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Notes (Optional)</label>
              <textarea formControlName="notes" rows="3"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Any additional information..."></textarea>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    [disabled]="form.invalid || loading()"
                    class="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]">
              @if (loading()) {
                Saving...
              } @else {
                Save Transaction
              }
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
  `
})
export class AddTransactionComponent {
  private fb = inject(FormBuilder);
  router = inject(Router);
  ratesService = inject(RatesService);
  private transactionsService = inject(TransactionsService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  loading = signal(false);
  error = signal<string | null>(null);
  marketRate = signal<number | null>(null);
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  form = this.fb.group({
    provider: ['', Validators.required],
    amount_sent: [0, [Validators.required, Validators.min(0.01)]],
    currency_sent: ['CAD', Validators.required],
    target_currency: ['NGN', Validators.required],
    exchange_rate: [0, [Validators.required, Validators.min(0)]],
    fee_amount: [0, [Validators.required, Validators.min(0)]],
    category: ['Family Support', Validators.required],
    recipient_country: ['', Validators.required],
    notes: ['']
  });

  async getLiveRate() {
    const source = this.form.value.currency_sent!;
    const target = this.form.value.target_currency!;

    const rate = await this.ratesService.getRate(source, target);
    
    if (rate) {
      this.marketRate.set(rate);
      this.form.patchValue({ exchange_rate: rate });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const values = this.form.value;
    const marketRate = this.marketRate() || values.exchange_rate!;
    
    // Calculate rate difference percentage
    const rate_diff_pct = ((values.exchange_rate! - marketRate) / marketRate) * 100;

    const transaction = {
      provider: values.provider!,
      amount_sent: values.amount_sent!,
      currency_sent: values.currency_sent!,
      target_currency: values.target_currency!,
      exchange_rate: values.exchange_rate!,
      market_rate: marketRate,
      fee_amount: values.fee_amount!,
      rate_diff_pct: rate_diff_pct,
      category: values.category!,
      recipient_country: values.recipient_country!,
      notes: values.notes || undefined,
      user_id: this.authService.user()?.id
    };

    const result = await this.transactionsService.createTransaction(transaction);

    if (result.error) {
      this.error.set(result.error.message);
      this.loading.set(false);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
