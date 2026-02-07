import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Mobile Header -->
      <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1e3a8a] dark:bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v2H9V5zm0 4h2v6H9V9z"/>
            </svg>
          </div>
          <h1 class="text-lg font-bold">DiaspoTrack</h1>
        </div>
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
      <aside [class]="'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e3a8a] dark:bg-gray-800 text-white flex flex-col transform transition-transform duration-300 lg:transform-none ' + (mobileMenuOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')">
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
          <a routerLink="/add-transaction" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
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
          <a routerLink="/alerts" routerLinkActive="bg-orange-500" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
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
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Alerts</h2>
          </div>
          <div class="flex items-center space-x-2 lg:space-x-4">
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" (click)="themeService.toggle()">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <span class="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">Welcome, <strong>{{ authService.user()?.email?.split('@')[0] || 'User' }}</strong></span>
          </div>
        </header>

        <!-- Alerts Content -->
        <div class="p-4 lg:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <!-- Exchange Rate Alerts -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center">
                <span class="text-orange-500 mr-2">📈</span>
                Exchange Rate Alerts
              </h3>
              <p class="text-sm text-gray-600 mb-4">Get notified when exchange rates hit your target</p>
              
              <form [formGroup]="rateAlertForm" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">From Currency</label>
                    <select formControlName="fromCurrency" class="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="USD">USD</option>
                      <option value="CAD">CAD</option>
                      <option value="GBP">GBP</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">To Currency</label>
                    <select formControlName="toCurrency" class="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="NGN">NGN</option>
                      <option value="GHS">GHS</option>
                      <option value="KES">KES</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">Target Rate</label>
                  <input type="number" formControlName="targetRate" step="0.01" 
                         class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., 1420.00">
                </div>
                <button type="button" (click)="addRateAlert()"
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
                  Set Alert
                </button>
              </form>

              <div class="mt-4 space-y-2">
                <p class="text-xs font-semibold text-gray-600 uppercase">Active Alerts</p>
                @if (rateAlerts().length === 0) {
                  <p class="text-sm text-gray-500 py-2">No active rate alerts</p>
                } @else {
                  @for (alert of rateAlerts(); track alert.id) {
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div class="text-sm">
                        <span class="font-medium">{{ alert.from }}</span> → 
                        <span class="font-medium">{{ alert.to }}</span>
                        <span class="text-gray-600 ml-2">&#64; {{ alert.rate }}</span>
                      </div>
                      <button (click)="removeRateAlert(alert.id)" class="text-red-600 hover:text-red-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Budget Alerts -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center">
                <span class="text-orange-500 mr-2">💰</span>
                Budget Alerts
              </h3>
              <p class="text-sm text-gray-600 mb-4">Set spending limits for categories</p>
              
              <form [formGroup]="budgetAlertForm" class="space-y-3">
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">Category</label>
                  <select formControlName="category" class="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="Family Support">Family Support</option>
                    <option value="Education">Education</option>
                    <option value="Medical">Medical</option>
                    <option value="Housing">Housing</option>
                    <option value="All Categories">All Categories</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">Monthly Limit</label>
                  <input type="number" formControlName="limit" step="10" 
                         class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., 1000">
                </div>
                <button type="button" (click)="addBudgetAlert()"
                        class="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 text-sm font-semibold">
                  Set Budget Limit
                </button>
              </form>

              <div class="mt-4 space-y-2">
                <p class="text-xs font-semibold text-gray-600 uppercase">Active Budgets</p>
                @if (budgetAlerts().length === 0) {
                  <p class="text-sm text-gray-500 py-2">No budget limits set</p>
                } @else {
                  @for (alert of budgetAlerts(); track alert.id) {
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div class="text-sm">
                        <span class="font-medium">{{ alert.category }}</span>
                        <span class="text-gray-600 ml-2">\${{ alert.limit }}/month</span>
                      </div>
                      <button (click)="removeBudgetAlert(alert.id)" class="text-red-600 hover:text-red-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                }
              </div>
            </div>
          </div>

          <!-- Notification Preferences -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold mb-4 dark:text-white">Notification Preferences</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Notifications</h4>
                @for (pref of emailPreferences; track pref.id) {
                  <label class="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" [checked]="pref.enabled" (change)="toggleEmailPref(pref.id)" 
                           class="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <div>
                      <p class="text-sm font-medium text-gray-800 dark:text-white">{{ pref.label }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ pref.description }}</p>
                    </div>
                  </label>
                }
              </div>
              <div class="space-y-4">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Push Notifications</h4>
                @for (pref of pushPreferences; track pref.id) {
                  <label class="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" [checked]="pref.enabled" (change)="togglePushPref(pref.id)"
                           class="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <div>
                      <p class="text-sm font-medium text-gray-800 dark:text-white">{{ pref.label }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ pref.description }}</p>
                    </div>
                  </label>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AlertsComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  rateAlerts = signal<any[]>([]);
  budgetAlerts = signal<any[]>([]);
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  rateAlertForm = this.fb.group({
    fromCurrency: ['USD', Validators.required],
    toCurrency: ['NGN', Validators.required],
    targetRate: [0, [Validators.required, Validators.min(0)]]
  });

  budgetAlertForm = this.fb.group({
    category: ['Family Support', Validators.required],
    limit: [0, [Validators.required, Validators.min(0)]]
  });

  emailPreferences = [
    { id: 1, label: 'Rate Alerts', description: 'When exchange rates hit your target', enabled: true },
    { id: 2, label: 'Budget Warnings', description: 'When approaching spending limits', enabled: true },
    { id: 3, label: 'Transaction Receipts', description: 'Confirmation of each transaction', enabled: false },
    { id: 4, label: 'Monthly Reports', description: 'Summary of monthly activity', enabled: true }
  ];

  pushPreferences = [
    { id: 1, label: 'Rate Changes', description: 'Significant rate fluctuations', enabled: true },
    { id: 2, label: 'Budget Exceeded', description: 'When you exceed a budget', enabled: true },
    { id: 3, label: 'New Features', description: 'Updates and new features', enabled: false }
  ];

  addRateAlert() {
    if (this.rateAlertForm.valid) {
      const alert = {
        id: Date.now(),
        from: this.rateAlertForm.value.fromCurrency!,
        to: this.rateAlertForm.value.toCurrency!,
        rate: this.rateAlertForm.value.targetRate!
      };
      this.rateAlerts.update(alerts => [...alerts, alert]);
      this.rateAlertForm.patchValue({ targetRate: 0 });
    }
  }

  removeRateAlert(id: number) {
    this.rateAlerts.update(alerts => alerts.filter(a => a.id !== id));
  }

  addBudgetAlert() {
    if (this.budgetAlertForm.valid) {
      const alert = {
        id: Date.now(),
        category: this.budgetAlertForm.value.category!,
        limit: this.budgetAlertForm.value.limit!
      };
      this.budgetAlerts.update(alerts => [...alerts, alert]);
      this.budgetAlertForm.patchValue({ limit: 0 });
    }
  }

  removeBudgetAlert(id: number) {
    this.budgetAlerts.update(alerts => alerts.filter(a => a.id !== id));
  }

  toggleEmailPref(id: number) {
    const pref = this.emailPreferences.find(p => p.id === id);
    if (pref) pref.enabled = !pref.enabled;
  }

  togglePushPref(id: number) {
    const pref = this.pushPreferences.find(p => p.id === id);
    if (pref) pref.enabled = !pref.enabled;
  }
}
