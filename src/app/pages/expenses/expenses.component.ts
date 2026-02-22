import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
          <a routerLink="/expenses" routerLinkActive="bg-orange-500" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
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
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Expenses</h2>
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
            <span class="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">Welcome, <strong>{{ authService.user()?.email?.split('@')[0] || 'User' }}</strong></span>
          </div>
        </header>

        <!-- Expenses Content -->
        <div class="p-4 lg:p-8">
          <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">Track Your Expenses</h3>
              <p class="text-sm lg:text-base text-gray-600 dark:text-gray-400">Monitor spending across all categories</p>
            </div>
            <button routerLink="/add-transaction" 
                    class="bg-orange-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-orange-600 font-semibold flex items-center justify-center space-x-2 text-sm lg:text-base">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Add Expense</span>
            </button>
          </div>

          <!-- Category Summary Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
            @for (category of categories; track category.name) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" [style.background-color]="category.color">
                      <span class="text-2xl">{{ category.icon }}</span>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-800 dark:text-white">{{ category.name }}</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.count }} transactions</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-baseline justify-between">
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">\${{ category.amount | number:'1.2-2' }}</p>
                  <p class="text-sm" [class.text-green-600]="category.change >= 0" [class.text-red-600]="category.change < 0">
                    {{ category.change >= 0 ? '+' : '' }}{{ category.change }}%
                  </p>
                </div>
                <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="h-2 rounded-full" [style.width.%]="category.percentage" [style.background-color]="category.color"></div>
                </div>
              </div>
            }
          </div>

          <!-- Recent Transactions -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold dark:text-white">Recent Transactions</h4>
              <button class="text-sm text-primary-600 hover:text-primary-700 font-semibold">View All</button>
            </div>
            
            @if (loading()) {
              <div class="space-y-3">
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="animate-pulse flex items-center justify-between py-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div>
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                }
              </div>
            } @else if (transactions().length === 0) {
              <div class="text-center py-12">
                <svg class="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-600 dark:text-gray-400">No transactions yet</p>
                <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Start tracking your expenses</p>
              </div>
            } @else {
              <div class="space-y-2">
                @for (tx of transactions().slice(0, 10); track tx.id) {
                  <div class="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2">
                    <div class="flex items-center space-x-4">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center" [style.background-color]="getCategoryColor(tx.category)">
                        <span class="text-lg">{{ getCategoryIcon(tx.category) }}</span>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-800 dark:text-white">{{ tx.category }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ tx.provider }} • {{ tx.created_at | date:'MMM d, yyyy' }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900 dark:text-white">\${{ tx.amount_sent | number:'1.2-2' }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ tx.currency_sent }}</p>
                    </div>
                  </div>
                }
              </div>
            }
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
export class ExpensesComponent implements OnInit {
  transactionsService = inject(TransactionsService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  transactions = this.transactionsService.transactions;
  loading = this.transactionsService.loading;
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  categories = [
    { name: 'Housing', icon: '🏠', amount: 800, count: 12, change: -2.5, percentage: 48, color: '#1e3a8a' },
    { name: 'Utilities', icon: '⚡', amount: 167, count: 8, change: 3.2, percentage: 10, color: '#60a5fa' },
    { name: 'Groceries', icon: '🛒', amount: 233, count: 25, change: -1.8, percentage: 14, color: '#93c5fd' },
    { name: 'Transportation', icon: '🚗', amount: 83, count: 15, change: 0.5, percentage: 5, color: '#bfdbfe' },
    { name: 'Family Support', icon: '👨‍👩‍👧', amount: 333, count: 6, change: 5.2, percentage: 20, color: '#f97316' },
    { name: 'Entertainment', icon: '🎬', amount: 50, count: 10, change: -4.1, percentage: 3, color: '#fb923c' }
  ];

  ngOnInit() {
    this.transactionsService.loadTransactions();
  }

  getCategoryIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'Family Support': '👨‍👩‍👧',
      'Education': '📚',
      'Medical': '🏥',
      'Business': '💼',
      'Housing': '🏠',
      'Utilities': '⚡',
      'Groceries': '🛒',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Other': '📌'
    };
    return icons[category] || '📌';
  }

  getCategoryColor(category: string): string {
    const colors: {[key: string]: string} = {
      'Family Support': '#f97316',
      'Education': '#eab308',
      'Medical': '#ef4444',
      'Business': '#8b5cf6',
      'Housing': '#1e3a8a',
      'Utilities': '#60a5fa',
      'Groceries': '#93c5fd',
      'Transportation': '#bfdbfe',
      'Entertainment': '#fb923c',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  }
}
